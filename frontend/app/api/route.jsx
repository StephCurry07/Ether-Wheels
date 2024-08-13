import axios from 'axios';
import { NextResponse } from 'next/server';

function formatResponse(response) {
  // Replace double asterisks with HTML <strong> tags for bold text
  let formattedText = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Replace line breaks for list points
  formattedText = formattedText.replace(/(?:\r\n|\r|\n)/g, '<br>');

  return formattedText;
}
export async function POST(req) {

  if (req.method === 'POST') {
    const body = await req.json();
    const { message } = body;
    console.log(message);
    const mistralRequest = {
      // model: "mistral-small-latest",
      // temperature: 0.7,
      max_tokens: 250,
      messages: [{
        role: "user",
        content: message
      }],
      agent_id: 'ag:435a15b1:20240808:untitled-agent:3ad78ecf'
    };

    try {
      const response = await axios.post('https://api.mistral.ai/v1/agents/completions', mistralRequest, {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      return NextResponse.json({ response: response.data.choices[0].message.content.trim()});
    } catch (error) {
      console.error('Mistral API request failed:', error);
      return NextResponse.json({ error: 'Failed to fetch response from Mistral API' }, { status: 500 });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
