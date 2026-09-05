import {createHmac} from "node:crypto";

interface GenerateSignatureParam{
    total_amount:string;
    transactionUUID :string;
    product_code:string;
}