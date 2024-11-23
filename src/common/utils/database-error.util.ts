import { Prisma } from '@prisma/client';

export function databaseErrorHandler(
  error:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientInitializationError,
): string {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return 'An error occurred while connecting to the database.';
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const metadata = error.meta as Record<string, unknown> | undefined;

    switch (error.code) {
      case 'P2002': // Unique constraint failed
        const model = metadata?.modelName as string | undefined;
        const fields = (metadata?.target as string[] | undefined)?.join(', ');
        return `${model ? `${model} with` : 'Entity with'} the same ${fields || 'fields'} already exists.`;

      case 'P2003': // Foreign key constraint failed
        const relatedModel = metadata?.modelName as string | undefined;
        const field = (metadata?.field_name as string | undefined)?.split(
          '_',
        )[0];
        return `${relatedModel || 'Entity'} cannot be deleted without removing the associated ${field || 'relation'}.`;

      default:
        return `An unknown database error occurred. Code: ${error.code}`;
    }
  }

  return 'An unexpected error occurred while interacting with the database.';
}
