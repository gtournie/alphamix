import { Kind } from '@sinclair/typebox'
import { ErrorFunctionParameter, ValueErrorType } from '@sinclair/typebox/errors'

export function DefaultErrorFunction(error: ErrorFunctionParameter) {
  switch (error.errorType) {
    case ValueErrorType.ArrayContains:
      return 'Tableau doit contenir au moins une valeur correspondante'
    case ValueErrorType.ArrayMaxContains:
      return `Tableau doit contenir au maximum ${error.schema.maxContains} valeurs correspondantes`
    case ValueErrorType.ArrayMinContains:
      return `Tableau doit contenir au moins ${error.schema.minContains} valeurs correspondantes`
    case ValueErrorType.ArrayMaxItems:
      return `Longueur du tableau doit être inférieure ou égale à ${error.schema.maxItems}`
    case ValueErrorType.ArrayMinItems:
      return `Longueur du tableau doit être supérieure ou égale à ${error.schema.minItems}`
    case ValueErrorType.ArrayUniqueItems:
      return 'Les éléments du tableau doivent être uniques'
    case ValueErrorType.Array:
      return 'Tableau attendu'
    case ValueErrorType.AsyncIterator:
      return 'AsyncIterator attendu'
    case ValueErrorType.BigIntExclusiveMaximum:
      return `BigInt doit être inférieur à ${error.schema.exclusiveMaximum}`
    case ValueErrorType.BigIntExclusiveMinimum:
      return `BigInt doit être supérieur à ${error.schema.exclusiveMinimum}`
    case ValueErrorType.BigIntMaximum:
      return `BigInt doit être inférieur ou égal à ${error.schema.maximum}`
    case ValueErrorType.BigIntMinimum:
      return `BigInt doit être supérieur ou égal à ${error.schema.minimum}`
    case ValueErrorType.BigIntMultipleOf:
      return `BigInt doit être un multiple de ${error.schema.multipleOf}`
    case ValueErrorType.BigInt:
      return 'BigInt attendu'
    case ValueErrorType.Boolean:
      return 'Booléen attendu'
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      return `Timestamp de la date doit être supérieur à ${error.schema.exclusiveMinimumTimestamp}`
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      return `Timestamp de la date doit être inférieur à ${error.schema.exclusiveMaximumTimestamp}`
    case ValueErrorType.DateMinimumTimestamp:
      return `Timestamp de la date doit être supérieur ou égal à ${error.schema.minimumTimestamp}`
    case ValueErrorType.DateMaximumTimestamp:
      return `Timestamp de la date doit être inférieur ou égal à ${error.schema.maximumTimestamp}`
    case ValueErrorType.DateMultipleOfTimestamp:
      return `Timestamp de la date doit être un multiple de ${error.schema.multipleOfTimestamp}`
    case ValueErrorType.Date:
      return 'Date attendue'
    case ValueErrorType.Function:
      return 'Fonction attendue'
    case ValueErrorType.IntegerExclusiveMaximum:
      return `Entier doit être inférieur à ${error.schema.exclusiveMaximum}`
    case ValueErrorType.IntegerExclusiveMinimum:
      return `Entier doit être supérieur à ${error.schema.exclusiveMinimum}`
    case ValueErrorType.IntegerMaximum:
      return `Entier doit être inférieur ou égal à ${error.schema.maximum}`
    case ValueErrorType.IntegerMinimum:
      return `Entier doit être supérieur ou égal à ${error.schema.minimum}`
    case ValueErrorType.IntegerMultipleOf:
      return `Entier doit être un multiple de ${error.schema.multipleOf}`
    case ValueErrorType.Integer:
      return 'Entier attendu'
    case ValueErrorType.IntersectUnevaluatedProperties:
      return 'Propriété inattendue'
    case ValueErrorType.Intersect:
      return 'Toutes les valeurs doivent correspondre'
    case ValueErrorType.Iterator:
      return 'Iterator attendu'
    case ValueErrorType.Literal:
      return `Valeur attendue : ${typeof error.schema.const === 'string' ? `'${error.schema.const}'` : error.schema.const}`
    case ValueErrorType.Never:
      return 'Jamais'
    case ValueErrorType.Not:
      return 'La valeur ne doit pas correspondre'
    case ValueErrorType.Null:
      return 'Null attendu'
    case ValueErrorType.NumberExclusiveMaximum:
      return `Nombre doit être inférieur à ${error.schema.exclusiveMaximum}`
    case ValueErrorType.NumberExclusiveMinimum:
      return `Nombre doit être supérieur à ${error.schema.exclusiveMinimum}`
    case ValueErrorType.NumberMaximum:
      return `Nombre doit être inférieur ou égal à ${error.schema.maximum}`
    case ValueErrorType.NumberMinimum:
      return `Nombre doit être supérieur ou égal à ${error.schema.minimum}`
    case ValueErrorType.NumberMultipleOf:
      return `Nombre doit être un multiple de ${error.schema.multipleOf}`
    case ValueErrorType.Number:
      return 'Nombre attendu'
    case ValueErrorType.Object:
      return 'Objet attendu'
    case ValueErrorType.ObjectAdditionalProperties:
      return 'Propriété inattendue'
    case ValueErrorType.ObjectMaxProperties:
      return `Objet doit avoir au maximum ${error.schema.maxProperties} propriétés`
    case ValueErrorType.ObjectMinProperties:
      return `Objet doit avoir au moins ${error.schema.minProperties} propriétés`
    case ValueErrorType.ObjectRequiredProperty:
      return 'Propriété requise attendue'
    case ValueErrorType.Promise:
      return 'Promise attendue'
    case ValueErrorType.RegExp:
      return 'Chaîne doit correspondre à l\'expression régulière'
    case ValueErrorType.StringFormatUnknown:
      return `Format inconnu '${error.schema.format}'`
    case ValueErrorType.StringFormat:
      return `Chaîne doit correspondre au format '${error.schema.format}'`
    case ValueErrorType.StringMaxLength:
      return `Longueur de la chaîne doit être inférieure ou égale à ${error.schema.maxLength}`
    case ValueErrorType.StringMinLength:
      return `Longueur de la chaîne doit être supérieure ou égale à ${error.schema.minLength}`
    case ValueErrorType.StringPattern:
      return `Chaîne doit correspondre au motif '${error.schema.pattern}'`
    case ValueErrorType.String:
      return 'Chaîne attendue'
    case ValueErrorType.Symbol:
      return 'Symbole attendu'
    case ValueErrorType.TupleLength:
      return `Tuple doit avoir ${error.schema.maxItems || 0} éléments`
    case ValueErrorType.Tuple:
      return 'Tuple attendu'
    case ValueErrorType.Uint8ArrayMaxByteLength:
      return `Longueur en octets doit être inférieure ou égale à ${error.schema.maxByteLength}`
    case ValueErrorType.Uint8ArrayMinByteLength:
      return `Longueur en octets doit être supérieure ou égale à ${error.schema.minByteLength}`
    case ValueErrorType.Uint8Array:
      return 'Uint8Array attendu'
    case ValueErrorType.Undefined:
      return 'Indéfini attendu'
    case ValueErrorType.Union:
      return 'Valeur d\'union attendue'
    case ValueErrorType.Void:
      return 'Void attendu'
    case ValueErrorType.Kind:
      return `Type attendu : '${error.schema[Kind]}'`
    default:
      return 'Type d\'erreur inconnu'
  }
}