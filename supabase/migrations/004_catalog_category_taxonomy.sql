-- Taxonomía clínica para el catálogo. La sincronización de inventario asigna
-- cada producto a uno de estos grupos por su uso principal.
insert into categories (name, slug, description, image, sort_order)
values
  ('Guantes', 'guantes', 'Guantes estériles y no estériles.', '/guantes.png', 10),
  ('Curación, apósitos y vendajes', 'curacion', 'Gasas, vendas, apósitos y material para el cuidado de heridas.', '/material-curacion.png', 20),
  ('Antisépticos y control de infecciones', 'antisepticos', 'Antisépticos, desinfectantes y preparación de piel.', '/material-curacion.png', 30),
  ('Agujas, jeringas y punción', 'jeringas', 'Agujas hipodérmicas, jeringas y dispositivos de punción.', '/vias-iv.png', 40),
  ('Terapia intravenosa y soluciones', 'terapia-iv', 'Venoclisis, accesos, soluciones y terapia de infusión.', '/vias-iv.png', 50),
  ('Sondas, catéteres y drenajes', 'sondas-cateteres', 'Sondas de alimentación y urinarias, drenajes y ostomía.', '/sondas-cateteres.png', 60),
  ('Terapia respiratoria y ventilación', 'respiratorio', 'Oxigenoterapia, vía aérea, succión y ventilación.', '/ventilacion.png', 70),
  ('Diagnóstico y monitoreo', 'diagnostico', 'Medición, monitoreo y consumibles de diagnóstico.', '/diagnostico.png', 80),
  ('Equipo e instrumental quirúrgico', 'quirurgico', 'Instrumental, suturas y consumibles para procedimientos.', '/equipo-quirurgico.png', 90),
  ('Rehabilitación y ortopedia', 'rehabilitacion', 'Soportes, inmovilización y recuperación funcional.', '/rehabilitacion.png', 100),
  ('Medicamentos', 'medicamentos', 'Medicamentos y fármacos de uso profesional.', '/diagnostico.png', 110),
  ('Protección y desechables', 'proteccion-desechables', 'Equipo de protección personal y consumibles desechables.', '/miscelaneos.png', 120),
  ('Gestión de residuos', 'residuos', 'Contenedores, bolsas y material para RPBI.', '/miscelaneos.png', 130),
  ('Atención al paciente y generales', 'atencion-paciente', 'Higiene, comodidad y accesorios generales de atención.', '/miscelaneos.png', 140)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order;
