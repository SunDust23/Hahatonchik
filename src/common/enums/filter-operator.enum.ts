export enum FilterOperator {
    EQ = 'eq',                // Равно
    NEQ = 'neq',              // Не равно
    GTE = 'gte',              // Больше или равно
    LTE = 'lte',              // Меньше или равно
    GT = 'gt',                // Больше
    LT = 'lt',                // Меньше
    CICONT = 'cicontains',    // Содержит (регистр не учитывается)
    CONTAINS = 'contains',    // Содержит (регистр учитывается)
    NOT_CONTAINS = 'notContains', // Не содержит
    IS_EMPTY = 'isEmpty',     // Пусто ("" или null)
    IS_NOT_EMPTY = 'isNotEmpty', // Не пусто (не "" и не null)
    IN = 'in',                // В списке
    NOT_IN = 'notIn',         // Не в списке
    BETWEEN = 'between',      // Между диапазоном
    CONTAINS_ANY = 'containsAny', // Содержит любое из массива
    NOT_CONTAINS_ANY = 'notContainsAny', // Не содержит ни одного из массива
  }
  