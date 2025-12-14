const API_KEY = "AIzaSyDL7mwFuEQZgN4rHOZrU_L93YTtKw6z1jk"; // In production, move to env var

export interface ExtractedData {
    position: number;
    team: string;
    kills: number;
}

export async function analyzeImage(base64Image: string, mimeType: string): Promise<ExtractedData[]> {
    try {
        // Remove header from base64 string if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.split(',')[1] || base64Image;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: `Analise esta imagem de tabela de resultados de Free Fire.
                
Identifique cada linha da tabela e extraia as seguintes informações:
1. A posição/rank (#) - número da colocação
2. O nome da equipe ou jogador
3. O número de abates (kills)

Retorne os dados no formato JSON a seguir (sem usar markdown \`\`\`json):
[
  {"position": 1, "team": "Nome da Equipe", "kills": 10},
  {"position": 2, "team": "Nome da Equipe 2", "kills": 8}
]

Ordene pela posição. Se houver alguma dúvida sobre uma linha, ignore-a.
Seja preciso na leitura dos números e nomes.`
                            },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Data
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("API Response Error:", errorData);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("No content returned from AI");
        }

        const textResponse = data.candidates[0].content.parts[0].text;

        // Clean up potential markdown formatting (just in case)
        const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(cleanedJson);

        // Validate that we got an array
        if (!Array.isArray(parsed)) {
            throw new Error("Expected array response from AI");
        }

        return parsed;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
}
