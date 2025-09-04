import fs from 'fs';
import path from 'path';

const MARKDOWN_DIR = path.join(process.cwd(), 'data', 'markdown');
const DATA_FILE = path.join(process.cwd(), 'app', '(editor)', 'layout.data.ts');
const STORE_FILE = path.join(process.cwd(), 'app', '(editor)', 'layout.stores.ts');

interface FileInfo {
  path: string;
  content: string;
  displayName: string;
}

function escapeForJavaScript(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function buildNestedStructure(): { structure: Record<string, any>, navigationData: any[], fileInfos: FileInfo[] } {
  const structure: Record<string, any> = {};
  const fileInfos: FileInfo[] = [];
  
  function walkDirectory(dir: string, relativePath = ''): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const itemRelativePath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        walkDirectory(fullPath, itemRelativePath);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        const pathParts = itemRelativePath.split(path.sep);
        const fileName = sanitizeFileName(pathParts.pop()!);
        const displayName = item.name.replace(/\.md$/, '');
        
        let current = structure;
        for (const part of pathParts) {
          const dirName = sanitizeFileName(part);
          if (!current[dirName]) {
            current[dirName] = {};
          }
          current = current[dirName];
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        current[fileName] = escapeForJavaScript(content);
        
        fileInfos.push({
          path: itemRelativePath,
          content: content,
          displayName: displayName
        });
        
        console.log(`Loaded ${itemRelativePath} -> ${[...pathParts.map(sanitizeFileName), fileName].join('.')}`);
      }
    }
  }
  
  walkDirectory(MARKDOWN_DIR);
  
  const navigationData = generateNavigationFromFiles(fileInfos);
  
  return { structure, navigationData, fileInfos };
}

function generateNavigationFromFiles(fileInfos: FileInfo[]): any[] {
  const navigationMap: Record<string, any> = {};
  
  for (const fileInfo of fileInfos) {
    const pathParts = fileInfo.path.split(path.sep);
    const fileName = pathParts.pop()!.replace(/\.md$/, '');
    
    if (pathParts.length === 0) {
      navigationMap[sanitizeFileName(fileName)] = {
        name: fileName,
        type: "page"
      };
    } else {
      const dirKey = sanitizeFileName(pathParts[0]);
      
      if (!navigationMap[dirKey]) {
        navigationMap[dirKey] = {
          name: pathParts[0],
          type: "segment",
          children: []
        };
      }
      
      navigationMap[dirKey].children.push({
        name: fileName,
        type: "page"
      });
    }
  }
  
  return Object.values(navigationMap);
}

function readMarkdownFiles(): { markdownContent: Record<string, any>, navigationData: any[], fileInfos: FileInfo[] } {
  console.log('Building nested markdown structure...');
  const { structure, navigationData, fileInfos } = buildNestedStructure();
  return { markdownContent: structure, navigationData, fileInfos };
}

function generateEditorStateInterface(obj: Record<string, any>, indent = 2): string {
  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'string') {
      return `${spaces}${key}: string;`;
    } else if (typeof value === 'object') {
      return `${spaces}${key}: {\n${generateEditorStateInterface(value, indent + 2)}\n${spaces}};`;
    }
    return `${spaces}${key}: string;`;
  });
  return entries.join('\n');
}

function generateContentPaths(obj: Record<string, any>, prefix = ''): string[] {
  const paths: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      paths.push(`"${currentPath}"`);
    } else if (typeof value === 'object') {
      paths.push(...generateContentPaths(value, currentPath));
    }
  });
  
  return paths;
}

function generateDocumentKeys(obj: Record<string, any>, prefix = ''): string[] {
  const keys: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const camelCaseKey = prefix ? `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}` : key;
    
    if (typeof value === 'string') {
      keys.push(`"${camelCaseKey}"`);
    } else if (typeof value === 'object') {
      keys.push(...generateDocumentKeys(value, camelCaseKey));
    }
  });
  
  return keys;
}

function generateUrlMapping(fileInfos: FileInfo[]): Record<string, any> {
  const urlMapping: Record<string, any> = {};
  
  for (const fileInfo of fileInfos) {
    const pathParts = fileInfo.path.split(path.sep);
    const fileName = pathParts.pop()!.replace(/\.md$/, '');
    
    if (pathParts.length === 0) {
      const sanitizedName = sanitizeFileName(fileName);
      urlMapping[fileName.toLowerCase()] = sanitizedName;
    } else {
      const dirName = pathParts[0];
      const sanitizedDirName = sanitizeFileName(dirName);
      const sanitizedFileName = sanitizeFileName(fileName);
      const contentPath = `${sanitizedDirName}.${sanitizedFileName}`;
      
      if (!urlMapping[dirName.toLowerCase()]) {
        urlMapping[dirName.toLowerCase()] = {};
      }
      
      urlMapping[dirName.toLowerCase()][fileName.toLowerCase()] = contentPath;
    }
  }
  
  return urlMapping;
}

function generateDataFile(markdownContent: Record<string, any>, navigationData: any[], urlMapping: Record<string, any>): string {
  function serializeObject(obj: any, indent = 2): string {
    const spaces = ' '.repeat(indent);
    const entries = Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${spaces}${key}: \`${value}\``;
      } else if (typeof value === 'object') {
        return `${spaces}${key}: {\n${serializeObject(value, indent + 2)}\n${spaces}}`;
      }
      return `${spaces}${key}: ${value}`;
    });
    return entries.join(',\n');
  }
  
  const serializedContent = serializeObject(markdownContent);
  const serializedNavigation = JSON.stringify(navigationData, null, 2);
  const serializedUrlMapping = JSON.stringify(urlMapping, null, 2);
  
  const editorStateInterface = generateEditorStateInterface(markdownContent);
  const contentPaths = generateContentPaths(markdownContent);
  const documentKeys = generateDocumentKeys(markdownContent);
  
  return `import { NavigationItem } from "@/configuration";

export const markdownContent = {
${serializedContent}
};

export const navigationData: NavigationItem[] = ${serializedNavigation};

export const urlToContentPathMapping = ${serializedUrlMapping};

export interface EditorState {
${editorStateInterface}
  setContent: (path: ContentPath, content: string) => void;
  getContent: (path: ContentPath) => string;
  reset: () => void;
}

export type ContentPath =
  | ${contentPaths.join('\n  | ')};

export type DocumentKey =
  | ${documentKeys.join('\n  | ')};
`;
}

function createDataFile(dataFileContent: string): void {
  fs.writeFileSync(DATA_FILE, dataFileContent, 'utf8');
  console.log('Successfully created layout.data.ts with markdown content and navigation data');
}

function updateStoreFile(): void {
  const storeContent = fs.readFileSync(STORE_FILE, 'utf8');
  
  let updatedContent = storeContent;
  
  if (!updatedContent.includes('import { markdownContent }')) {
    updatedContent = updatedContent.replace(
      'import { EditorState } from "./layout.types";',
      'import { EditorState } from "./layout.types";\nimport { markdownContent } from "./layout.data";'
    );
  }
  
  if (!updatedContent.includes('const initialState = markdownContent;')) {
    const initialStateRegex = /const initialState = \{[\s\S]*?\};/;
    
    if (initialStateRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(initialStateRegex, 'const initialState = markdownContent;');
    } else if (updatedContent.includes('const initialState = markdownContent;')) {
      console.log('Store file already uses markdownContent');
    } else {
      throw new Error('Could not find initialState in store file');
    }
  }
  
  fs.writeFileSync(STORE_FILE, updatedContent, 'utf8');
  
  console.log('Successfully updated layout.stores.ts to use layout.data.ts');
}

function main(): void {
  console.log('Compiling markdown files to store initial state...');
  
  try {
    const { markdownContent, navigationData, fileInfos } = readMarkdownFiles();
    const urlMapping = generateUrlMapping(fileInfos);
    const dataFileContent = generateDataFile(markdownContent, navigationData, urlMapping);
    createDataFile(dataFileContent);
    updateStoreFile();
    
    console.log('Markdown compilation completed successfully!');
    console.log('Generated nested structure with top-level keys:', Object.keys(markdownContent));
    console.log('Generated navigation items:', navigationData.length);
    console.log('Generated URL mappings:', Object.keys(urlMapping));
  } catch (error) {
    console.error('Error during markdown compilation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}