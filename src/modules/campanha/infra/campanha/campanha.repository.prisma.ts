import { PrismaClient } from '@prisma/client';
import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { CampanhaMap } from '../mappers/campanha.map';
import { ICampanhaRepository } from './campanha.repository.interface';

export class CampanhaRepositoryPrisma implements ICampanhaRepository {
  constructor(private readonly prisma: PrismaClient) {}

async inserir(campanha: Campanha): Promise<void> {
  const dadosParaPersistencia = CampanhaMap.toPersistence(campanha);

  console.log("Dados para persistência:", dadosParaPersistencia);
  
  // Garante que empresaId exista
  if (!campanha.empresaId) {
    throw new Error("empresaId é obrigatório para criar uma campanha");
  }

  // Remove relações para lidar separadamente
  const { empresa, formulario, ...dadosEscalares } = dadosParaPersistencia;

  await this.prisma.campanha.create({
    data: {
      ...dadosEscalares,
      empresa: { connect: { id: campanha.empresaId } }, // <- garante id válido
      formulario: { connect: { id: campanha.formularioId } },
    },
  });
}


  async atualizar(campanha: Campanha): Promise<void> {
    const dadosParaPersistencia = CampanhaMap.toPersistence(campanha);
    // Removemos a relação do objeto principal para o Prisma lidar com ela separadamente
    const { formulario, empresa, ...dadosEscalares } = dadosParaPersistencia;

    await this.prisma.campanha.update({
      where: { id: campanha.id },
      data: {
        ...dadosEscalares, // Atualiza campos como titulo, descricao, etc.
        formulario: { // Conecta ao formulário, caso o ID tenha mudado
          connect: { id: campanha.formularioId },
        },
        empresa: { connect: { id: campanha.empresaId } },
      },
    });
  }

async recuperarPorUuid(id: string, empresaId: string): Promise<Campanha | null> {
  console.log("DADOS RECUPERADOS", empresaId);

  const campanhaPrisma = await this.prisma.campanha.findFirst({
    where: { id, empresaId },
    include: {
      formulario: {
        include: {
          perguntas: {
            include: {
              pergunta: {
                select: {
                  id: true,
                  tipo: true,
                  texto: true,
                  opcoes: true,
                }
              } // inclui tipo, texto, opcoes
            }
          }
        }
      }
    }
  });

  if (!campanhaPrisma) return null;

  console.log("campanhaPrisma:", campanhaPrisma);

  return CampanhaMap.toDomainWithFormulario(campanhaPrisma);
}



async listar(empresaId: string): Promise<Campanha[]> {
  const campanhasPrisma = await this.prisma.campanha.findMany({
    where: { empresaId },
    orderBy: { dataCriacao: 'desc' },
  });

  // ❌ Pode quebrar: campanhasPrisma.map(CampanhaMap.toDomain)
  // ✅ Correto:
  return campanhasPrisma.map(c => CampanhaMap.toDomain(c));
}





  async deletar(id: string): Promise<void> {
    await this.prisma.campanha.delete({
      where: { id },
    });
  }

  async existe(id: string): Promise<boolean> {
    const count = await this.prisma.campanha.count({
      where: { id },
    });
    return count > 0;
  }

  async recuperarParcial(id: string, empresaId: string): Promise<Partial<Campanha> | null> {
  const campanha = await this.prisma.campanha.findFirst({
    where: { id, empresaId },
    select: {
      id: true,
      canalEnvio: true,
      templateMensagem: true,
    },
  });

  if (!campanha) return null;

  return campanha; // Retorna um objeto parcial, sem instanciar a entidade completa
}
}