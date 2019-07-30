export interface CardEmployee {
  imageSource: string;
  title: string;
  subtitle?: string;
  id?: string;
  social?: CardEmployeeSocial;
  coverColors?: CardEmployeeCoverColors;
}

export interface CardEmployeeSocial {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
}

export interface CardEmployeeCoverColors {
  color1: string;
  color2: string;
}
