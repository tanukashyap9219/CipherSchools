cat > server/testConn.js <<'EOF'
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Testing connection to:', uri ? uri.replace(/:[^:]+@/,' :***@') : '<no URI set>');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('OK - connected');
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION ERROR:', err && err.message ? err.message : err);
    console.error('ERR FULL:', err);
    process.exit(1);
  }
})();
EOF
