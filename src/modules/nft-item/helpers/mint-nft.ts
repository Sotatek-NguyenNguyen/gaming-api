import { http } from 'src/common/http';
import { Creator, Data } from '../helpers/schema';

export const createMetadata = async (metadataLink: string): Promise<Data> => {
  // Metadata
  let metadata;
  try {
    metadata = await http.get(metadataLink);
  } catch (e) {
    console.error('Invalid metadata at', metadataLink, e);
    return;
  }

  // Validate metadata
  if (
    !metadata.name ||
    !metadata.image ||
    isNaN(metadata.seller_fee_basis_points) ||
    !metadata.properties ||
    !Array.isArray(metadata.properties.creators)
  ) {
    console.error('Invalid metadata file', metadata);
    return;
  }

  // Validate creators
  const metaCreators = metadata.properties.creators;
  if (
    metaCreators.some((creator) => !creator.address) ||
    metaCreators.reduce((sum, creator) => creator.share + sum, 0) !== 100
  ) {
    return;
  }

  const creators = metaCreators.map(
    (creator) =>
      new Creator({
        address: creator.address,
        share: creator.share,
        verified: 1,
      }),
  );

  return new Data({
    symbol: metadata.symbol,
    name: metadata.name,
    uri: metadataLink,
    sellerFeeBasisPoints: metadata.seller_fee_basis_points,
    creators: creators,
  });
};
