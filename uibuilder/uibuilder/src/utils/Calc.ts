class Calc {
	static range(n: number, p: {minin: number; maxin: number; minout: number; maxout: number}, type: 'roll' | 'clamp', round: boolean, fixto: number): number {
		if (type == 'clamp') {
			if (n < p.minin) {
				n = p.minin;
			}
			if (n > p.maxin) {
				n = p.maxin;
			}
		}
		if (type == 'roll') {
			var d: number = p.maxin - p.minin;
			n = ((((n - p.minin) % d) + d) % d) + p.minin;
		}
		var v: number = ((n - p.minin) / (p.maxin - p.minin)) * (p.maxout - p.minout) + p.minout;
		if (round) {
			v = Math.round(v);
		} else {
			if (fixto) {
				v = parseFloat(v.toFixed(fixto));
			}
		}
		return v;
	}
}
