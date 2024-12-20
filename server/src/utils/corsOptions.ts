export const corsOptions = {
  origin: ["http://localhost:8000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
