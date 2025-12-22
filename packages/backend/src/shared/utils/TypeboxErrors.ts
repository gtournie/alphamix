import { Kind } from '@sinclair/typebox'
import { ErrorFunctionParameter, ValueErrorType } from '@sinclair/typebox/errors'

export function DefaultErrorFunction(error: ErrorFunctionParameter) {
  switch (error.errorType) {
    case ValueErrorType.ArrayContains:
      // 'Expected array to contain at least one matching value'
      return ['array_contains'];
    case ValueErrorType.ArrayMaxContains:
      // `Expected array to contain no more than ${error.schema.maxContains} matching values`
      return ['max_contains', error.schema.maxContains];
    case ValueErrorType.ArrayMinContains:
      // `Expected array to contain at least ${error.schema.minContains} matching values`
      return ['min_contains', error.schema.minContains];
    case ValueErrorType.ArrayMaxItems:
      // `Expected array length to be less or equal to ${error.schema.maxItems}`
      return ['max_length', error.schema.maxItems];
    case ValueErrorType.ArrayMinItems:
      // `Expected array length to be greater or equal to ${error.schema.minItems}`
      return ['min_length', error.schema.minItems];
    case ValueErrorType.ArrayUniqueItems:
      // 'Expected array elements to be unique'
      return ['unique_items'];
    case ValueErrorType.Array:
      // 'Expected array'
      return ['array'];
    case ValueErrorType.AsyncIterator:
      // 'Expected AsyncIterator'
      return ['async_iterator'];
    case ValueErrorType.BigIntExclusiveMaximum:
      // `Expected bigint to be less than ${error.schema.exclusiveMaximum}`
      return ['less_than', error.schema.exclusiveMaximum];
    case ValueErrorType.BigIntExclusiveMinimum:
      // `Expected bigint to be greater than ${error.schema.exclusiveMinimum}`
      return ['greater_than', error.schema.exclusiveMinimum];
    case ValueErrorType.BigIntMaximum:
      // `Expected bigint to be less or equal to ${error.schema.maximum}`
      return ['less_or_equal_to', error.schema.maximum];
    case ValueErrorType.BigIntMinimum:
      // `Expected bigint to be greater or equal to ${error.schema.minimum}`
      return ['greater_or_equal_to', error.schema.minimum];
    case ValueErrorType.BigIntMultipleOf:
      // `Expected bigint to be a multiple of ${error.schema.multipleOf}`
      return ['multiple_of', error.schema.multipleOf];
    case ValueErrorType.BigInt:
      // 'Expected bigint'
      return ['bigint'];
    case ValueErrorType.Boolean:
      // 'Expected boolean'
      return ['boolean'];
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      // `Expected Date timestamp to be greater than ${error.schema.exclusiveMinimumTimestamp}`
      return ['greater_than', error.schema.exclusiveMinimumTimestamp];
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      // `Expected Date timestamp to be less than ${error.schema.exclusiveMaximumTimestamp}`
      return ['less_than', error.schema.exclusiveMaximumTimestamp];
    case ValueErrorType.DateMinimumTimestamp:
      // `Expected Date timestamp to be greater or equal to ${error.schema.minimumTimestamp}`
      return ['greater_or_equal_to', error.schema.minimumTimestamp];
    case ValueErrorType.DateMaximumTimestamp:
      // `Expected Date timestamp to be less or equal to ${error.schema.maximumTimestamp}`
      return ['less_or_equal_to', error.schema.maximumTimestamp];
    case ValueErrorType.DateMultipleOfTimestamp:
      // `Expected Date timestamp to be a multiple of ${error.schema.multipleOfTimestamp}`
      return ['multiple_of', error.schema.multipleOfTimestamp];
    case ValueErrorType.Date:
      // 'Expected Date'
      return ['date'];
    case ValueErrorType.Function:
      // 'Expected function'
      return ['function'];
    case ValueErrorType.IntegerExclusiveMaximum:
      // `Expected integer to be less than ${error.schema.exclusiveMaximum}`
      return ['less_than', error.schema.exclusiveMaximum];
    case ValueErrorType.IntegerExclusiveMinimum:
      // `Expected integer to be greater than ${error.schema.exclusiveMinimum}`
      return ['greater_than', error.schema.exclusiveMinimum];
    case ValueErrorType.IntegerMaximum:
      // `Expected integer to be less or equal to ${error.schema.maximum}`
      return ['less_or_equal_to', error.schema.maximum];
    case ValueErrorType.IntegerMinimum:
      // `Expected integer to be greater or equal to ${error.schema.minimum}`
      return ['greater_or_equal_to', error.schema.minimum];
    case ValueErrorType.IntegerMultipleOf:
      // `Expected integer to be a multiple of ${error.schema.multipleOf}`
      return ['multiple_of', error.schema.multipleOf];
    case ValueErrorType.Integer:
      // 'Expected integer'
      return ['integer'];
    case ValueErrorType.IntersectUnevaluatedProperties:
      // 'Unexpected property'
      return ['unexpected_property'];
    case ValueErrorType.Intersect:
      // 'Expected all values to match'
      return ['all_values_match'];
    case ValueErrorType.Iterator:
      // 'Expected Iterator'
      return ['iterator'];
    case ValueErrorType.Literal:
      // `Expected ${typeof error.schema.const === 'string' ? `'${error.schema.const}'` : error.schema.const}`
      return ['literal', error.schema.const];
    case ValueErrorType.Never:
      // 'Never'
      return ['never'];
    case ValueErrorType.Not:
      // 'Value should not match'
      return ['not_match'];
    case ValueErrorType.Null:
      // 'Expected null'
      return ['null'];
    case ValueErrorType.NumberExclusiveMaximum:
      // `Expected number to be less than ${error.schema.exclusiveMaximum}`
      return ['less_than', error.schema.exclusiveMaximum];
    case ValueErrorType.NumberExclusiveMinimum:
      // `Expected number to be greater than ${error.schema.exclusiveMinimum}`
      return ['greater_than', error.schema.exclusiveMinimum];
    case ValueErrorType.NumberMaximum:
      // `Expected number to be less or equal to ${error.schema.maximum}`
      return ['less_or_equal_to', error.schema.maximum];
    case ValueErrorType.NumberMinimum:
      // `Expected number to be greater or equal to ${error.schema.minimum}`
      return ['greater_or_equal_to', error.schema.minimum];
    case ValueErrorType.NumberMultipleOf:
      // `Expected number to be a multiple of ${error.schema.multipleOf}`
      return ['multiple_of', error.schema.multipleOf];
    case ValueErrorType.Number:
      // 'Expected number'
      return ['number'];
    case ValueErrorType.Object:
      // 'Expected object'
      return ['object'];
    case ValueErrorType.ObjectAdditionalProperties:
      // 'Unexpected property'
      return ['unexpected_property'];
    case ValueErrorType.ObjectMaxProperties:
      // `Expected object to have no more than ${error.schema.maxProperties} properties`
      return ['max_properties', error.schema.maxProperties];
    case ValueErrorType.ObjectMinProperties:
      // `Expected object to have at least ${error.schema.minProperties} properties`
      return ['min_properties', error.schema.minProperties];
    case ValueErrorType.ObjectRequiredProperty:
      // 'Expected required property'
      return ['required_property'];
    case ValueErrorType.Promise:
      // 'Expected Promise'
      return ['promise'];
    case ValueErrorType.RegExp:
      // 'Expected string to match regular expression'
      return ['match_regex'];
    case ValueErrorType.StringFormatUnknown:
      // `Unknown format '${error.schema.format}'`
      return ['unknown_format', error.schema.format];
    case ValueErrorType.StringFormat:
      // `Expected string to match '${error.schema.format}' format`
      return ['match_format', error.schema.format];
    case ValueErrorType.StringMaxLength:
      // `Expected string length less or equal to ${error.schema.maxLength}`
      return ['max_length', error.schema.maxLength];
    case ValueErrorType.StringMinLength:
      // `Expected string length greater or equal to ${error.schema.minLength}`
      return ['min_length', error.schema.minLength];
    case ValueErrorType.StringPattern:
      // `Expected string to match '${error.schema.pattern}'`
      return ['match_pattern', error.schema.pattern];
    case ValueErrorType.String:
      // 'Expected string'
      return ['string'];
    case ValueErrorType.Symbol:
      // 'Expected symbol'
      return ['symbol'];
    case ValueErrorType.TupleLength:
      // `Expected tuple to have ${error.schema.maxItems || 0} elements`
      return ['tuple_length', error.schema.maxItems || 0];
    case ValueErrorType.Tuple:
      // 'Expected tuple'
      return ['tuple'];
    case ValueErrorType.Uint8ArrayMaxByteLength:
      // `Expected byte length less or equal to ${error.schema.maxByteLength}`
      return ['max_byte_length', error.schema.maxByteLength];
    case ValueErrorType.Uint8ArrayMinByteLength:
      // `Expected byte length greater or equal to ${error.schema.minByteLength}`
      return ['min_byte_length', error.schema.minByteLength];
    case ValueErrorType.Uint8Array:
      // 'Expected Uint8Array'
      return ['uint8array'];
    case ValueErrorType.Undefined:
      // 'Expected undefined'
      return ['undefined'];
    case ValueErrorType.Union:
      // 'Expected union value'
      return ['union_value'];
    case ValueErrorType.Void:
      // 'Expected void'
      return ['void'];
    case ValueErrorType.Kind:
      // `Expected kind '${error.schema[Kind]}'`
      return ['kind', error.schema[Kind]];
    default:
      // 'Unknown error type'
      return ['unknown_error'];
  }
}