export const env = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "ORION PMS",
  HOSPITAL_NAME: process.env.NEXT_PUBLIC_HOSPITAL_NAME ?? "JKKN Dental College & Hospital",
};
