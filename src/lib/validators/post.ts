import { z } from 'zod'

// We will define a schema that the react hook form will use to validate the form
// We can use this validator to to data validation on the server side as well as the client side
// Server side using the function provided by the zod library and in the client side using the react hook form
export const PostValidator = z.object({
    title: z
      .string()
      .min(3, {
        message: 'Title must be at least 3 characters long',
      })
      .max(128, {
        message: 'Title must be less than 128 characters long',
      }),
    subredditId: z.string(),
    content: z.any(),
  })
  
  export type PostCreationRequest = z.infer<typeof PostValidator>