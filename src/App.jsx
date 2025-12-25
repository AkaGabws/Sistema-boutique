import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'

// Importando as páginas
import Login from './pages/Login'
import Vendas from './pages/Vendas'
import Estoque from './pages/Estoque'
import Relatorios from './pages/Relatorios'
import Layout from './components/Layout' // <--- Importe o novo Layout

export default function App() {
  const [session, setSession] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) buscarPerfil(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) buscarPerfil(session.user.id)
      else setUsuario(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function buscarPerfil(id) {
    const { data } = await supabase.from('perfis').select('*').eq('id', id).single()
    setUsuario(data)
  }

  if (!session) return <Login />
  if (!usuario) return <div style={{display:'flex',justifyContent:'center',marginTop:'50px'}}>Carregando perfil...</div>

  return (
    <BrowserRouter>
      {/* O Layout abraça todas as rotas agora */}
      <Layout usuario={usuario}>
        <Routes>
          <Route path="/" element={<Vendas usuario={usuario} />} />
          <Route path="/produtos" element={<Estoque usuario={usuario} />} />
          <Route path="/relatorios" element={<Relatorios usuario={usuario} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}