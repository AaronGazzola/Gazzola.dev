"use client";

import { DynamicComponent } from "../layout.data";
import { DynamicSelect } from "./DynamicSelect";

interface DynamicComponentRendererProps {
  component: DynamicComponent;
  onContentChange?: (componentId: string, content: string) => void;
}

export const DynamicComponentRenderer = ({ component, onContentChange }: DynamicComponentRendererProps) => {
  const handleSelectionChange = (value: string, content: string) => {
    onContentChange?.(component.id, content);
  };

  switch (component.type) {
    case 'select':
      return (
        <DynamicSelect
          id={component.id}
          options={component.options}
          onSelectionChange={handleSelectionChange}
        />
      );
    default:
      return null;
  }
};

interface DynamicComponentsProps {
  components: DynamicComponent[];
  onContentChange?: (componentId: string, content: string) => void;
}

export const DynamicComponents = ({ components, onContentChange }: DynamicComponentsProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-components">
      {components.map((component) => (
        <DynamicComponentRenderer
          key={component.id}
          component={component}
          onContentChange={onContentChange}
        />
      ))}
    </div>
  );
};