/**
 * Global test data store accessible across all step definitions.
 */
export class GlobalData {
  private static data: Record<string, any> = {};
  private static policyNumber: string = '';

  /**
   * Set the entire data object.
   */
  static setData(data: Record<string, any>) {
    GlobalData.data = data;
  }

  /**
   * Get the entire data object.
   */
  static getData(): Record<string, any> {
    return GlobalData.data;
  }

  /**
   * Set the policy number.
   */
  static setPolicyNumber(policyNumber: string) {
    GlobalData.policyNumber = policyNumber;
  }

  /**
   * Get the policy number.
   */
  static getPolicyNumber(): string {
    return GlobalData.policyNumber;
  }

  /**
   * Get a value by dotted path (e.g., "Insured.NamedInsured1.firstName").
   */
  static getValue(path: string): any {
    const parts = path.split('.');
    let current = GlobalData.data;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }

  /**
   * Clear the data.
   */
  static clear() {
    GlobalData.data = {};
  }
}
