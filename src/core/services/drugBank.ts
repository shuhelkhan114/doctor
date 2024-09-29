import { drugBankConfig } from '@core/config/app';
import { drugBankInstance } from '@core/lib/axios';
import { DrugNamesResponse } from '@typings/drugbank';

export const searchMedications = async (term: string) => {
  return drugBankInstance
    .get<DrugNamesResponse>(`/drug_names?region=${drugBankConfig.region}&q=${term}`)
    .then((res) => {
      const mappedData: { [key: string]: any } = {};

      res.data.products.forEach((product) => {
        if (mappedData[product.name]) {
          mappedData[product.name] = {
            ...mappedData[product.name],
            dosages: [...mappedData[product.name].dosages, product.strength],
          };
        } else {
          mappedData[product.name] = {
            ...product,
            dosages: [product.strength],
          };
        }
      });

      return res.data.products;
    });
};
