import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Store } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [isCadastro, setIsCadastro] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (isCadastro) {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { nome: nome } }
      })
      if (error) alert("Erro: " + error.message)
      else alert("Cadastrado! Faça login.")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert("Erro: " + error.message)
    }
    setLoading(false)
  }

  // Estilos da Paleta La Belli
  const colors = {
    bg: '#F5F5F2', // Fundo bege bem clarinho
    primary: '#A89082', // Marrom Nude/Cappuccino
    dark: '#4A4A4A', // Cinza Chumbo
    white: '#FFFFFF'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: colors.bg, fontFamily: 'sans-serif' }}>
      <div style={{ background: colors.white, padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', width: '100%', maxWidth: '380px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', background: colors.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: colors.primary }}>
            <Store size={28} />
          </div>
          <h2 style={{ margin: 0, color: colors.dark, fontSize: '24px', fontWeight: '600' }}>La Belli</h2>
          <p style={{ margin: '5px 0 0', color: '#9CA3AF', fontSize: '14px' }}>Moda Fashion</p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {isCadastro && (
            <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FAFAFA', outline: 'none' }} />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FAFAFA', outline: 'none' }} />
          
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FAFAFA', outline: 'none' }} />
          
          <button type="submit" disabled={loading} 
            style={{ padding: '12px', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>
            {loading ? '...' : (isCadastro ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
          <span onClick={() => setIsCadastro(!isCadastro)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {isCadastro ? 'Já tenho conta' : 'Criar nova conta'}
          </span>
        </div>
      </div>
    </div>
  )
}