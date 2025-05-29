import { Metaplex } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';
import { FailedToFetchDataError } from '../errors';
import { TokenDetails, TokenRequest } from '../types';

const connection = new Connection('https://go.getblock.io/4136d34f90a6488b84214ae26f0ed5f4');

export async function getTokenDetails({
  tokenAddress,
  solanaAmount,
  tokenMarketCapInSolana,
  tokenAmount,
  currencySymbol,
}: TokenRequest): Promise<TokenDetails> {
  const metaplex = Metaplex.make(connection);
  const tokenPublicKey = new PublicKey(tokenAddress);

  const tokenDetails = await metaplex.nfts().findByMint({ mintAddress: tokenPublicKey });

  const paiPriceRequest = await fetch(
    `https://api.coinbase.com/api/v3/brokerage/market/products/SOL-${currencySymbol}`,
  );
  if (!paiPriceRequest.ok) throw new FailedToFetchDataError();

  const { price, quote_name }: { price: number, quote_name: string } = await paiPriceRequest.json();

  return {
    tokenAddress,
    tokenName: tokenDetails.name,
    tokenSymbol: tokenDetails.symbol,
    currencyName: quote_name,
    currencySymbol,
    solanaPrice: Number(price),
    solanaAmount,
    tokenMarketCapInSolana,
    tokenAmount,
    tokenUnitPrice: (solanaAmount / tokenAmount) * price,
    tokenTotalValue: solanaAmount * price,
    tokenMarketCap: tokenMarketCapInSolana * price,
  };
}
