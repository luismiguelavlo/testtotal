export class DepartmentalInformation {
  constructor(
    public plate: string,
    public declaration: number | null,
    public validity: number,
    public registrationMunicipalityCode: string,
    public registrationDepartmentCode: string,
    public registrationMunicipality: string,
    public registrationDepartment: string,
    public appraisedValue: number,
    public tax: number,
    public penalty: number | null,
    public interest: number | null,
    public discount: number,
    public penaltyDiscount: number | null,
    public interestDiscount: number | null,
    public balanceToPay: number | null,
    public system: number,
    public total: number | null,
    public destinationMunicipalityCode: string,
    public destinationDepartmentCode: string,
    public destinationMunicipality: string,
    public destinationDepartment: string,
    public municipalityValue: number | null,
    public departmentValue: number | null,
    public dueDate: string,
    public observation: string
  ) {}
}

export class MunicipalInformation {
  constructor(
    public validity: number,
    public liquidationNumber: number,
    public invoiceCode: string,
    public totalTransit: number,
    public totalConsortium: number,
    public transitSystem: number,
    public plate: string,
    public registrationMunicipality: string,
    public observation: string
  ) {}
}

export class Validity {
  constructor(
    public departmentalInformation: DepartmentalInformation[],
    public municipalInformation: MunicipalInformation[]
  ) {}
}
