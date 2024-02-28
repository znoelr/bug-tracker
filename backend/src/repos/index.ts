import repos from './prisma-repos';
// import repos from './typeorm-models';

export const { repository, connect, disconnect } = repos;
