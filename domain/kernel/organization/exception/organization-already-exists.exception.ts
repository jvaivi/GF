export class OrganizationAlreadyExistsError extends Error {
  constructor(message: string, readonly organizationName: string) {
    super(message);
  }
}
