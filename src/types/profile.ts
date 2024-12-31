export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface CompanyInfo {
  companyName: string;
  companyDescription: string;
  whatsappNumber: string;
  companyEmail: string;
  country: string;
  city: string;
  businessSector: string;
  documentNumber: string;
}

export interface WithdrawalInfo {
  momoProvider: string;
  momoNumber: string;
  autoTransfer: boolean;
  withdrawalFirstName: string;
  withdrawalLastName: string;
  withdrawalEmail: string;
}