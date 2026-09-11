export {
  FIELD_TYPES,
  CONFIDENCE_LEVELS,
  type FieldType,
  type ConfidenceLevel,
} from './types';
export { setNativeValue, setNativeFile, getCurrentValue, fileMatchesAccept } from './set-value';
export {
  buildFillPlan,
  executeFillPlan,
  autofillFields,
  type FillPlanItem,
  type FillResult,
  type AutofillFiles,
} from './fill';
