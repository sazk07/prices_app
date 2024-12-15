import { z } from "zod";

export const purchaseSchema = z.object({
  shopId: z.number({
    invalid_type_error: "Invalid Shop ID",
  }),
  productId: z.number({
    invalid_type_error: "Invalid Product ID",
  }),
  purchaseDate: z.string().date("Purchase Date must be a valid date").trim(),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .nonnegative({
      message: "Quantity must be a non-negative number",
    })
    .finite({
      message: "Quantity must be a finite number",
    }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({
      message: "Price must be a non-negative number",
    })
    .finite({
      message: "Price must be a finite number",
    }),
  taxRate: z
    .number()
    .nonnegative({
      message: "Tax Rate must be a non-negative number",
    })
    .finite({
      message: "Tax Rate must be a finite number",
    })
    .optional(),
  taxAmount: z
    .number()
    .nonnegative({
      message: "Tax Amount must be a non-negative number",
    })
    .finite({
      message: "Tax Amount must be a finite number",
    })
    .optional(),
  mrpTaxAmount: z
    .number()
    .nonnegative({
      message: "MRP Tax Amount must be a non-negative number",
    })
    .finite({
      message: "MRP Tax Amount must be a finite number",
    })
    .optional(),
  nonMrpTaxAmount: z
    .number()
    .nonnegative({
      message: "Non-MRP Tax Amount must be a non-negative number",
    })
    .finite({
      message: "Non-MRP Tax Amount must be a finite number",
    })
    .optional(),
});

export const purchaseIdSchema = z
  .number({
    message: "ID must be a number",
  })
  .int({
    message: "Invalid ID",
  })
  .finite({
    message: "ID must be a finite number",
  })
  .nonnegative({
    message: "ID must be a non-negative number",
  });
