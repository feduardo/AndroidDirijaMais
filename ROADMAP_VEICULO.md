ROADMAP - Cadastro de Veículos do Instrutor📋 Resumo
Implementação completa de CRUD de veículos para instrutores, do banco de dados ao frontend mobile.


🗂️ FASE 1: ANÁLISE E PLANEJAMENTO
1.1 Levantamento de Requisitos

✅ Identificar necessidade: instrutor cadastrar veículos usados nas aulas
✅ Definir campos: marca, modelo, ano, placa, tipo de câmbio, fotos
✅ Regra de negócio: apenas 1 veículo primário por instrutor
✅ Decisão de UX: tela única com modal (não múltiplas telas)

1.2 Análise da Estrutura Existente

✅ Verificar estrutura do backend (Python/FastAPI)
✅ Verificar estrutura do frontend (React Native)
✅ Identificar padrões de código existentes
✅ Localizar tabela instructor_vehicles no BD


🗄️ FASE 2: BANCO DE DADOS
2.1 Análise da Tabela Existente


\d instructor_vehicles


✅ Campos: id, instructor_id, brand, model, year, plate, photos, is_primary, created_at, updated_at, is_active

2.2 Adicionar Constraint de Unicidade


CREATE UNIQUE INDEX instructor_vehicles_unique_primary 
ON instructor_vehicles (instructor_id) 
WHERE is_primary = true;


✅ Garante apenas 1 veículo primário por instrutor

2.3 Adicionar Campo Tipo de Câmbio

ALTER TABLE instructor_vehicles 
ADD COLUMN transmission_type VARCHAR(20);

UPDATE instructor_vehicles 
SET transmission_type = 'manual' 
WHERE transmission_type IS NULL;

ALTER TABLE instructor_vehicles 
ALTER COLUMN transmission_type SET NOT NULL;

🐍 FASE 3: BACKEND (Python/FastAPI)
3.1 Domain Layer - Entities
Arquivo: app/domain/entities/models.py


class InstructorVehicle(Base):
    # ... campos existentes
    transmission_type = Column(String(20), nullable=False)


    3.2 Domain Layer - Repository
Arquivo: app/domain/repositories/vehicle_repository.py


class VehicleRepository:
    def create(...)
    def get_by_id(...)
    def get_all_by_instructor(...)
    def get_primary(...)
    def update(...)
    def soft_delete(...)
    def unset_all_primary(...)


✅ Registrado em __init__.py

3.3 Domain Layer - Service
Arquivo: app/domain/services/vehicle_service.py


class VehicleService:
    async def create_vehicle(...)
    async def update_vehicle(...)
    async def delete_vehicle(...)
    async def get_instructor_vehicles(...)
    async def get_vehicle(...)



✅ Validações de dados
✅ Gerenciamento de veículo primário
✅ Registrado em __init__.py

3.4 Presentation Layer - Schemas
Arquivo: app/presentation/schemas/vehicle.py


class TransmissionType(str, Enum):
    MANUAL = "manual"
    AUTOMATIC = "automatic"

class VehicleCreateRequest(BaseModel): ...
class VehicleUpdateRequest(BaseModel): ...
class VehicleResponse(BaseModel): ...
class VehicleListResponse(BaseModel): ...

3.5 Presentation Layer - Router
Arquivo: app/presentation/routers/instructor_vehicles.py


POST   /instructor/vehicles       # Criar
GET    /instructor/vehicles       # Listar
GET    /instructor/vehicles/{id}  # Buscar
PATCH  /instructor/vehicles/{id}  # Atualizar
DELETE /instructor/vehicles/{id}  # Deletar


✅ Registrado em main.py com prefix /api/v1

3.6 Testes da API


# Listar
curl GET /api/v1/instructor/vehicles

# Criar
curl POST /api/v1/instructor/vehicles
{
  "brand": "Fiat",
  "model": "Uno",
  "year": 2018,
  "plate": "XYZ9876",
  "transmission_type": "manual",
  "is_primary": false
}


📱 FASE 4: FRONTEND (React Native)
4.1 Domain Layer - Entity
Arquivo: src/domain/entities/Vehicle.entity.ts


export interface Vehicle { ... }
export interface VehicleCreateDTO { ... }
export interface VehicleUpdateDTO { ... }


4.2 Infrastructure Layer - Repository
Arquivo: src/infrastructure/repositories/VehicleRepository.ts


✅ Corrigido basePath: /api/v1/instructor/vehicles

4.3 Presentation Layer - Screen
Arquivo: src/presentation/screens/instructor/InstructorVehiclesScreen.tsx
Componentes:

✅ Lista de veículos (FlatList)
✅ Cards com informações (brand, model, year, plate, transmission)
✅ Badge "PRINCIPAL" para veículo primário
✅ Botões de editar/excluir
✅ Modal de cadastro/edição
✅ Dropdowns de marca/modelo (11 marcas, 40+ modelos)
✅ Seletor de tipo de câmbio (SegmentedButtons)
✅ Seletor de veículo principal (SegmentedButtons)

Marcas e Modelos:


const VEHICLE_DATA = {
  Fiat: ['Mobi', 'Argo', 'Cronos', 'Fastback', 'Pulse'],
  Volkswagen: ['Polo', 'Virtus', 'Nivus', 'T-Cross'],
  Chevrolet: ['Onix', 'Onix Plus', 'Prisma', 'Tracker', 'Spin'],
  // ... 8 marcas adicionais
}


4.4 Navigation - Routing
Arquivo: src/presentation/navigation/InstructorStack.tsx


export type InstructorStackParamList = {
  InstructorVehicles: undefined;
  // ...
}

<Stack.Screen 
  name="InstructorVehicles" 
  component={InstructorVehiclesScreen}
  options={{ headerShown: true, title: 'Meus Veículos' }}
/>

4.5 Navigation - Drawer Menu
Arquivo: src/presentation/navigation/InstructorDrawer.tsx


<DrawerItem
  label="Meus Veículos"
  icon={({ color, size }) => (
    <MaterialCommunityIcons name="car" size={size} color={color} />
  )}
  onPress={() => props.navigation.navigate('InstructorMain', { 
    screen: 'InstructorVehicles' 
  })}
/>
```

---

## ✅ FASE 5: TESTES E VALIDAÇÃO

### 5.1 Testes de Integração
- ✅ Login como instrutor
- ✅ Acessar menu "Meus Veículos"
- ✅ Criar novo veículo
- ✅ Editar veículo existente
- ✅ Excluir veículo
- ✅ Validar persistência após logout/login
- ✅ Validar constraint de veículo primário

### 5.2 Logs de Sucesso
```
REQUEST: GET /api/v1/instructor/vehicles → 200
REQUEST: POST /api/v1/instructor/vehicles → 201
REQUEST: DELETE /api/v1/instructor/vehicles/{id} → 204


📊 MÉTRICAS DO PROJETO
CategoriaQuantidadeArquivos criados5Arquivos modificados7Linhas de código (Backend)~400Linhas de código (Frontend)~350Endpoints criados5Tabelas modificadas1Tempo estimado4-6 horas


🎯 PRÓXIMOS PASSOS (Backlog)
Features Futuras

 Upload de fotos do veículo (AWS S3 / Cloudinary)
 Validação de placa com API externa (SINESP)
 Mostrar veículos na tela de reserva do aluno
 Histórico de veículos inativos
 Relatório de uso por veículo
 Integração com seguro do veículo

Melhorias Técnicas

 Testes unitários (Backend)
 Testes de componente (Frontend)
 Cache de lista de veículos
 Otimização de imagens
 Paginação (se >20 veículos)


🔧 STACK TECNOLÓGICA UTILIZADA
Backend:

Python 3.10+
FastAPI
SQLAlchemy (ORM)
PostgreSQL
Pydantic (validação)

Frontend:

React Native
TypeScript
React Native Paper (UI)
Axios (HTTP)
React Navigation

Arquitetura:

Clean Architecture
Domain-Driven Design (DDD)
Repository Pattern
Dependency Injection


📝 LIÇÕES APRENDIDAS

Ordem dos Hooks: Todos os useState devem estar no topo, antes de qualquer condicional
URL Base: Sempre verificar se /api/v1 está no caminho correto
UX Simplificada: Modal é melhor que múltiplas telas para CRUD simples
Validação de Dados: Dropdowns reduzem erros de digitação
Constraint no BD: Garante integridade mesmo se frontend falhar