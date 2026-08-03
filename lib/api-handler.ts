import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

type RouteContext = {
  params?: Record<string, string>;
};

type RouteHandler = (
  req: NextRequest,
  context: RouteContext
) => Promise<NextResponse>;

/**
 * Wraps a Next.js App Router route handler with consistent error handling.
 * All uncaught errors are logged server-side and return a generic 500 response.
 * Zod validation errors return 400 with field-level error details.
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      // Log full error server-side only
      console.error('[API Error]', {
        method: req.method,
        url: req.url,
        error,
      });

      // Handle Zod validation errors with field-level details
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path.join('.');
          if (field) fieldErrors[field] = issue.message;
        }
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed. Please check your input.',
            fieldErrors,
          },
          { status: 400 }
        );
      }

      // Generic error — never expose internal details to client
      return NextResponse.json(
        {
          success: false,
          error: 'Something went wrong. Please try again.',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Returns a standardised success response.
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Returns a standardised error response.
 */
export function apiError(
  message: string,
  status = 400,
  fieldErrors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    { success: false, error: message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status }
  );
}
