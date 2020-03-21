export interface User {
  id: string;
  name: {
    givenName: string;
    middleName?: string;
    familyName: string;
  };
  locale?: string;
  emails: string[];
  picture?: string;
}
