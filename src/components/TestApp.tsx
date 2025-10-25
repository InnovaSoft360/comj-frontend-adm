// components/TestApp.tsx
export default function TestApp() {
  console.log('🚀 TestApp está renderizando!');
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      ✅ APP FUNCIONANDO - React está rodando!
    </div>
  );
}