'use client';

import { useState, useEffect } from 'react';
import { useWallet } from './WalletProvider';
import { useContract } from '@/hooks/useContract';

const CONTRACT_ID = process.env.NEXT_PUBLIC_GACHA_CONTRACT_ID || '';

const PRIZE_ANIMATIONS = {
  0: { emoji: '🪣', color: '#FFD700', name: 'Bucket' },
  1: { emoji: '📌', color: '#FF6B6B', name: 'Botton' },
  2: { emoji: '🔑', color: '#4ECDC4', name: 'Chaveiro' },
  3: { emoji: '💨', color: '#95A5A6', name: 'Nada' },
};

export function GachaMachine() {
  const { connected, address, network, connect } = useWallet();
  const { loading, lastResult, error, openChest, getPrizeInfo, PRIZES } = useContract();

  const [showResult, setShowResult] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'revealed'>('idle');

  const handleOpenChest = async () => {
    if (!address) return;

    setAnimationPhase('spinning');
    setShowResult(false);
    setCurrentPrize(null);

    const result = await openChest(CONTRACT_ID, address);

    if (result.success && result.result !== undefined) {
      setTimeout(() => {
        setCurrentPrize(result.result!);
        setAnimationPhase('revealed');
        setShowResult(true);
      }, 1500);
    }
  };

  useEffect(() => {
    // getLastResult is now handled by useContract hook
    if (connected && address && CONTRACT_ID) {
      // The useContract hook will handle reading last result
    }
  }, [connected, address]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Máquina de Gacha
        </h1>
        <p className="text-gray-400">Abra baús na rede Stellar - 1 XLM por tentativa</p>
      </header>

      {/* Wallet Connection */}
      {!connected ? (
        <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold mb-2">Conecte sua carteira</h2>
          <p className="text-gray-400 mb-4">Use a extensão Freighter para assinar transações</p>
          <button
            onClick={connect}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Conectar Freighter
          </button>
        </div>
      ) : (
        <>
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>Conectado: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <span className="text-sm text-gray-400">Rede: {network}</span>
          </div>

          {/* Gacha Chest */}
          <div className="relative">
            <div
              className={`w-64 h-64 mx-auto transition-all duration-500 ${
                animationPhase === 'spinning' ? 'animate-pulse rotate-3 scale-105' : ''
              } ${animationPhase === 'revealed' ? 'animate-bounce' : ''}`}
              onClick={handleOpenChest}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {animationPhase === 'spinning' ? (
                  <div className="text-8xl animate-spin">🎁</div>
                ) : animationPhase === 'revealed' && currentPrize !== null ? (
                  <div className="text-12xl animate-bounce">
                    {PRIZE_ANIMATIONS[currentPrize as keyof typeof PRIZE_ANIMATIONS]?.emoji || '🎁'}
                  </div>
                ) : (
                  <div className="text-8xl">🎁</div>
                )}
              </div>
            </div>

            {animationPhase === 'idle' && !loading && (
              <p className="text-center text-gray-400 mt-4">Clique no baú para abrir</p>
            )}

            {animationPhase === 'spinning' && (
              <p className="text-center text-yellow-400 mt-4 animate-pulse">Abrindo baú...</p>
            )}
          </div>

          {/* Open Button */}
          <button
            onClick={handleOpenChest}
            disabled={loading || animationPhase !== 'idle' || !CONTRACT_ID}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            {loading ? 'Processando...' : animationPhase === 'spinning' ? 'Abrindo...' : 'Abrir Baú (1 XLM)'}
          </button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 text-center">
              Erro: {error}
            </div>
          )}

          {/* Result Display */}
          {showResult && currentPrize !== null && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-fade-in">
              <div className="text-center mb-4">
                <div
                  className="text-6xl mb-2"
                  style={{ filter: `drop-shadow(0 0 20px ${PRIZE_ANIMATIONS[currentPrize as keyof typeof PRIZE_ANIMATIONS]?.color})` }}
                >
                  {PRIZE_ANIMATIONS[currentPrize as keyof typeof PRIZE_ANIMATIONS]?.emoji}
                </div>
                <h2 className="text-3xl font-bold" style={{ color: PRIZE_ANIMATIONS[currentPrize as keyof typeof PRIZE_ANIMATIONS]?.color }}>
                  {PRIZE_ANIMATIONS[currentPrize as keyof typeof PRIZE_ANIMATIONS]?.name}
                </h2>
                {currentPrize === 3 ? (
                  <p className="text-gray-400 mt-2">Que pena! Tente novamente.</p>
                ) : (
                  <p className="text-green-400 mt-2">Parabéns! Você ganhou um prêmio físico!</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Probabilidade</p>
                  <p className="font-bold">{getPrizeInfo(currentPrize).probability}</p>
                </div>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setAnimationPhase('idle');
                    setCurrentPrize(null);
                  }}
                  className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}

          {/* Probability Table */}
          <details className="group bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <summary className="p-4 cursor-pointer flex items-center justify-between">
              <span className="font-semibold">Ver probabilidades</span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {PRIZES.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{PRIZE_ANIMATIONS[prize.id as keyof typeof PRIZE_ANIMATIONS]?.emoji}</span>
                    <div>
                      <p className="font-medium">{prize.name}</p>
                      <p className="text-sm text-gray-400">{prize.description}</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg" style={{ color: PRIZE_ANIMATIONS[prize.id as keyof typeof PRIZE_ANIMATIONS]?.color }}>
                    {prize.probability}
                  </span>
                </div>
              ))}
            </div>
          </details>

          {!CONTRACT_ID && (
            <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded-lg p-4 text-center">
              ⚠️ Contrato não configurado. Defina NEXT_PUBLIC_GACHA_CONTRACT_ID no .env.local
            </div>
          )}
        </>
      )}
    </div>
  );
}