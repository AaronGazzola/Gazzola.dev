import { InitialConfigurationType } from "@/app/(editor)/layout.types";
import {
  SECTION_OPTION_MAPPINGS,
  getConfigValue,
} from "@/lib/section-option-mappings";

export function applyAutomaticSectionFiltering(
  config: InitialConfigurationType,
  setSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string,
    include: boolean
  ) => void
): void {
  for (const mapping of SECTION_OPTION_MAPPINGS) {
    if (mapping.configPath === null) {
      setSectionInclude(
        mapping.filePath,
        mapping.sectionId,
        mapping.optionId,
        true
      );
      continue;
    }

    const configValue = getConfigValue(config, mapping.configPath);

    let shouldInclude = false;

    if (mapping.matchValue !== undefined) {
      shouldInclude = configValue === mapping.matchValue;
    } else {
      shouldInclude = Boolean(configValue);
    }

    setSectionInclude(
      mapping.filePath,
      mapping.sectionId,
      mapping.optionId,
      shouldInclude
    );
  }
}
