export type HcDataPoint = [string, number];

const UF_TO_HC_KEY: Record<string, string> = {
	AC: "br-ac",
	AL: "br-al",
	AP: "br-ap",
	AM: "br-am",
	BA: "br-ba",
	CE: "br-ce",
	DF: "br-df",
	ES: "br-es",
	GO: "br-go",
	MA: "br-ma",
	MT: "br-mt",
	MS: "br-ms",
	MG: "br-mg",
	PA: "br-pa",
	PB: "br-pb",
	PR: "br-pr",
	PE: "br-pe",
	PI: "br-pi",
	RJ: "br-rj",
	RN: "br-rn",
	RS: "br-rs",
	RO: "br-ro",
	RR: "br-rr",
	SC: "br-sc",
	SP: "br-sp",
	SE: "br-se",
	TO: "br-to",
};

export function ufToHcKey(uf: string): string | null {
	const key = UF_TO_HC_KEY[uf.toUpperCase()];
	return key ?? null;
}

export function hcKeyToUf(hcKey: string): string | null {
	const entry = Object.entries(UF_TO_HC_KEY).find(([_, key]) => key === hcKey);
	return entry ? entry[0] : null;
}

export function buildHcDataFromPairs(pairs: Array<{ uf: string; value: number }>): HcDataPoint[] {
	return pairs
		.map(({ uf, value }) => {
			const key = ufToHcKey(uf);
			if (!key) return null;
			return [key, value] as HcDataPoint;
		})
		.filter((p): p is HcDataPoint => Array.isArray(p));
}


