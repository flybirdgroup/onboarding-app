import neo4j from 'neo4j-driver';
const driver = neo4j.driver(
  process.env.NEO4J_URI || '',
  neo4j.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || '')
);
export const getSession = () => driver.session();
export const createNode = async (type: string, properties: any) => {
  const session = getSession();
  const result = await session.run(
    `CREATE (n:${type} $properties) RETURN n`,
    { properties }
  );
  session.close();
  return result.records[0].get('n').properties;
};

export const createRelationship = async (fromId: string, toId: string, type: string) => {
    const session = getSession();
    const result = await session.run(
      `
        MATCH (a {id: $fromId}), (b {id: $toId})
        CREATE (a)-[r:${type}]->(b)
        RETURN r
      `,
      { fromId, toId }
    );
    session.close();
    return result.records[0].get('r').properties;
  };

  export const getNodes = async () => {
    const session = getSession();
    const result = await session.run('MATCH (n) RETURN n');
    session.close();
    return result.records.map(record => record.get('n').properties);
  };

  export const getRelationships = async () => {
    const session = getSession();
    const result = await session.run('MATCH ()-[r]->() RETURN r');
    session.close();
    return result.records.map(record => record.get('r').properties);
  };