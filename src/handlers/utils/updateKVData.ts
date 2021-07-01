import { KVData } from "../../types";

export const updateKVData = (kv1: KVData, kv2: Partial<KVData>) => {
	return { ...kv1, ...kv2 };
}

export const mapUpdateKVData = (kv1: KVData[], kv2: (Partial<KVData>)[]) => {
	return kv1.map((item, index) => updateKVData(item, kv2[index]));
}