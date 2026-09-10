export {
  FIELD_TYPES,
  CONFIDENCE_LEVELS,
  type FieldType,
  type ConfidenceLevel,
} from './types';
export { setNativeValue, getCurrentValue } from './set-value';
export {
  buildFillPlan,
  executeFillPlan,
  autofillFields,
  type FillPlanItem,
  type FillResult,
} from './fill';
