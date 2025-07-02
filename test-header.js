// Test import of Header component
try {
    const Header = require('./src/components/layout/Header.tsx');
    console.log('Header import successful');
} catch (error) {
    console.error('Header import failed:', error.message);
}
