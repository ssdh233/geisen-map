declare module "imi-enrichment-address" {
  const whatever: (
    address: string
  ) => Promise<{
    住所: {
      都道府県: string;
      市区町村: string;
      町名: string;
    };
  }>;
  export default whatever;
}
