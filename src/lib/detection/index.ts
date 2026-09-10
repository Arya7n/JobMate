import {
  classifyFieldSignals,
  collectFieldSignals,
  displayLabelForField,
  isFillableElement,
  type DetectedField,
} from './classify';

export function scanDocument(root: ParentNode = document): DetectedField[] {
  const nodes = root.querySelectorAll('input, textarea, select');
  const fields: DetectedField[] = [];

  for (const node of nodes) {
    if (!isFillableElement(node)) {
      continue;
    }

    const signals = collectFieldSignals(node);
    const match = classifyFieldSignals(signals);
    if (match.type === 'unknown') {
      continue;
    }

    const field: DetectedField = {
      element: node,
      type: match.type,
      confidence: match.confidence,
      score: match.score,
      signals,
      label: '',
    };
    field.label = displayLabelForField(field);
    fields.push(field);
  }

  return fields;
}

export function summarizeScan(fields: DetectedField[]) {
  return {
    total: fields.length,
    high: fields.filter((field) => field.confidence === 'high').length,
    medium: fields.filter((field) => field.confidence === 'medium').length,
    low: fields.filter((field) => field.confidence === 'low').length,
  };
}

export type { DetectedField, FieldSignals, FieldMatch } from './classify';
export {
  classifyFieldSignals,
  collectFieldSignals,
  displayLabelForField,
  isFillableElement,
} from './classify';
