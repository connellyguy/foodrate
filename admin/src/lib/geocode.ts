type GeocodeResult = {
    lat: number;
    lng: number;
};

type NominatimResult = {
    lat: string;
    lon: string;
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocode(address: string): Promise<GeocodeResult | null> {
    try {
        const params = new URLSearchParams({
            q: address,
            format: 'json',
            limit: '1',
        });

        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
            headers: { 'User-Agent': 'OakRank-Admin/1.0' },
        });

        if (!response.ok) {
            return null;
        }

        const results: NominatimResult[] = await response.json();

        if (results.length === 0) {
            return null;
        }

        return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
        };
    } catch {
        return null;
    }
}
