/**
 * Global test data store accessible across all step definitions.
 */
export class GlobalData {
  private static data: Record<string, any> = {};
  private static policyNumber: string = '';
  private static currentPageName: string = '';
  private static submissionNumber: string = '';

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

  static setSubmissionNumber(submissionNumber: string) {
    GlobalData.submissionNumber = submissionNumber;
  }
  

  /**
   * Get the policy number.
   */
  static getSubmissionNumber(): string {
    return GlobalData.submissionNumber;
  }

  /**
   * Set the current page name
   */
  static setCurrentPage(pageName: string) {
    GlobalData.currentPageName = pageName;
  }
  

  /**
   * Get the current page name.
   */
  static currentPage(): string {
    return GlobalData.currentPageName;
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
