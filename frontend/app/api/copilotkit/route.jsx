import {
    CopilotRuntime,
    GroqAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
  } from '@copilotkit/runtime';
  import Groq from 'groq-sdk';
  import { NextRequest } from 'next/server';
   
  const groq = new Groq({ model: "llama3-8b-8192"  });
  const serviceAdapter = new GroqAdapter({ groq });
  const runtime = new CopilotRuntime();
   
  export const POST = async (req) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: '/api/copilotkit',
    });
   
    return handleRequest(req);
  };