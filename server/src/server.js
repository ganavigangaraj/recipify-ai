import app from './index.js'
const PORT = process.env.PORT || 4000;
// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
// app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));