import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { TrendingUp, ShoppingBag, DollarSign, Package, Award, Calendar } from 'lucide-react'

export default function Relatorios({ usuario }) {
  const [indicadores, setIndicadores] = useState({
    faturamento: 0,
    qtdVendas: 0,
    pecasVendidas: 0,
    ticketMedio: 0
  })
  
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('hoje') // 'hoje', 'semana', 'mes'

  useEffect(() => { carregarDados() }, [filtro])

  async function carregarDados() {
    setLoading(true)
    
    // 1. Definir Data de Corte
    const dataCorte = new Date()
    dataCorte.setHours(0, 0, 0, 0)

    if (filtro === 'semana') dataCorte.setDate(dataCorte.getDate() - 7)
    if (filtro === 'mes') dataCorte.setDate(dataCorte.getDate() - 30)

    const dataISO = dataCorte.toISOString()

    // 2. Buscar Vendas e Itens das Vendas
    // Precisamos dos itens para contar quantas peças saíram
    const { data: vendas, error } = await supabase
      .from('vendas')
      .select(`
        *,
        itens_venda ( qtd )
      `)
      .gte('created_at', dataISO)

    if (vendas) {
      // --- CÁLCULOS DOS CARDS ---
      const totalFat = vendas.reduce((acc, v) => acc + v.total, 0)
      const totalVendas = vendas.length
      
      // Soma a quantidade de itens dentro de cada venda
      const totalPecas = vendas.reduce((acc, v) => {
        const qtdItensVenda = v.itens_venda ? v.itens_venda.reduce((q, item) => q + item.qtd, 0) : 0
        return acc + qtdItensVenda
      }, 0)

      const ticket = totalVendas > 0 ? totalFat / totalVendas : 0

      setIndicadores({
        faturamento: totalFat,
        qtdVendas: totalVendas,
        pecasVendidas: totalPecas,
        ticketMedio: ticket
      })

      // --- CÁLCULO DO RANKING ---
      const mapVendedores = {}
      
      for (const venda of vendas) {
        if (!venda.vendedor_id) continue 
        
        if (!mapVendedores[venda.vendedor_id]) {
          const { data: perfil } = await supabase
            .from('perfis')
            .select('nome')
            .eq('id', venda.vendedor_id)
            .single()
            
          mapVendedores[venda.vendedor_id] = { 
            nome: perfil ? perfil.nome : 'Desconhecido', 
            qtd: 0, 
            total: 0 
          }
        }
        
        mapVendedores[venda.vendedor_id].qtd += 1
        mapVendedores[venda.vendedor_id].total += venda.total
      }

      const listaRanking = Object.values(mapVendedores).sort((a, b) => b.total - a.total)
      setRanking(listaRanking)
    }
    
    setLoading(false)
  }

  // Estilos Auxiliares
  const btnStyle = (ativo) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: ativo ? 'none' : '1px solid #E5E7EB',
    background: ativo ? 'var(--primary)' : 'white',
    color: ativo ? 'white' : '#6B7280',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: '0.2s'
  })

  const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #F3F4F6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* CABEÇALHO E FILTROS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Dashboard de Vendas</h1>
          <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: '14px' }}>Visão geral do desempenho.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: '#F9FAFB', padding: '4px', borderRadius: '24px' }}>
          <button style={btnStyle(filtro === 'hoje')} onClick={() => setFiltro('hoje')}>Hoje</button>
          <button style={btnStyle(filtro === 'semana')} onClick={() => setFiltro('semana')}>7 Dias</button>
          <button style={btnStyle(filtro === 'mes')} onClick={() => setFiltro('mes')}>30 Dias</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Carregando dados...</div>
      ) : (
        <>
          {/* GRID DE CARDS (KPIs) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginBottom: '30px' 
          }}>
            {/* Card 1: Faturamento */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>FATURAMENTO</span>
                <div style={{ padding: '8px', background: '#ECFDF5', borderRadius: '8px', color: '#059669' }}><DollarSign size={18} /></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                R$ {indicadores.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Card 2: Vendas Realizadas */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>VENDAS</span>
                <div style={{ padding: '8px', background: '#EFF6FF', borderRadius: '8px', color: '#2563EB' }}><ShoppingBag size={18} /></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {indicadores.qtdVendas}
              </div>
            </div>

            {/* Card 3: Peças Vendidas */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>PEÇAS VENDIDAS</span>
                <div style={{ padding: '8px', background: '#FFF7ED', borderRadius: '8px', color: '#EA580C' }}><Package size={18} /></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {indicadores.pecasVendidas}
              </div>
            </div>

            {/* Card 4: Ticket Médio */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>TICKET MÉDIO</span>
                <div style={{ padding: '8px', background: '#F5F3FF', borderRadius: '8px', color: '#7C3AED' }}><TrendingUp size={18} /></div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                R$ {indicadores.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* RANKING DE VENDEDORES */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="var(--primary)" /> Ranking de Vendedores
            </h3>

            {ranking.length === 0 ? (
              <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>Nenhuma venda registrada neste período.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ranking.map((r, index) => (
                  <div key={index} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '12px', borderRadius: '8px', border: '1px solid #F3F4F6',
                    background: index === 0 ? '#FEFCE8' : 'white' // Destaque para o 1º lugar
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: index === 0 ? '#FBBF24' : '#F3F4F6', 
                        color: index === 0 ? 'white' : '#6B7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {index + 1}º
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>{r.nome}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{r.qtd} vendas</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '16px' }}>
                        R$ {r.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}