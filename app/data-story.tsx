'use client';

import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import { useEffect, useMemo, useRef, useState } from 'react';
import geographyData from './gran-santiago.json';

type Segment = {
  name: string;
  value: number;
  detail?: string;
  crosses?: boolean;
};

const firstTwenty = [
  'San Ramón',
  'Lo Espejo',
  'Lo Prado',
  'Cerro Navia',
  'Conchalí',
  'La Granja',
  'Pedro Aguirre Cerda',
  'Renca',
  'El Bosque',
  'Cerrillos',
  'San Joaquín',
  'Independencia',
  'Quinta Normal',
  'La Pintana',
  'Quilicura',
  'Recoleta',
  'Estación Central',
  'Pudahuel',
  'La Cisterna',
  'Macul',
];

const segments: Segment[] = [
  {
    name: '20 comunas de menor monto',
    value: 1129,
    detail: firstTwenty.join(', '),
  },
  { name: 'San Bernardo', value: 254 },
  { name: 'Puente Alto', value: 355 },
  { name: 'Huechuraba', value: 380 },
  { name: 'Maipú', value: 431 },
  { name: 'San Miguel', value: 527 },
  { name: 'Santiago', value: 726 },
  { name: 'La Florida', value: 1072 },
  { name: 'Peñalolén', value: 1271 },
  { name: 'Ñuñoa', value: 2452 },
  { name: 'La Reina', value: 2923 },
  { name: 'Providencia', value: 2935, crosses: true },
];

const lasCondes = 13062;
const sanRamonBudget = 27856.833;
const lasCondesShareOfSanRamonBudget = (lasCondes / sanRamonBudget) * 100;
const totalThirty = 11520;
const totalThirtyOne = 14455;
const chartMax = 15000;
const number = new Intl.NumberFormat('es-CL');

type BudgetMetric = 'total' | 'perCapita';

const municipalBudgets = [
  {
    name: 'San Ramón',
    total: 27856.833,
    population: 76002,
    perCapita: 366528,
  },
  {
    name: 'Las Condes',
    total: 515474.435,
    population: 296134,
    perCapita: 1740680,
  },
];

type CommuneProperties = {
  COMUNA: string;
  DESC_COMUN: string;
};

type CommuneMetric = {
  name: string;
  value: number;
};

const geography = geographyData as unknown as FeatureCollection<Geometry, CommuneProperties>;

const mapValues: Record<string, CommuneMetric> = {
  '13101': { name: 'Santiago', value: 726 },
  '13102': { name: 'Cerrillos', value: 28 },
  '13103': { name: 'Cerro Navia', value: 5 },
  '13104': { name: 'Conchalí', value: 10 },
  '13105': { name: 'El Bosque', value: 26 },
  '13106': { name: 'Estación Central', value: 99 },
  '13107': { name: 'Huechuraba', value: 380 },
  '13108': { name: 'Independencia', value: 59 },
  '13109': { name: 'La Cisterna', value: 169 },
  '13110': { name: 'La Florida', value: 1072 },
  '13111': { name: 'La Granja', value: 12 },
  '13112': { name: 'La Pintana', value: 69 },
  '13113': { name: 'La Reina', value: 2923 },
  '13114': { name: 'Las Condes', value: 13062 },
  '13115': { name: 'Lo Barnechea', value: 8209 },
  '13116': { name: 'Lo Espejo', value: 4 },
  '13117': { name: 'Lo Prado', value: 4 },
  '13118': { name: 'Macul', value: 188 },
  '13119': { name: 'Maipú', value: 431 },
  '13120': { name: 'Ñuñoa', value: 2452 },
  '13121': { name: 'Pedro Aguirre Cerda', value: 13 },
  '13122': { name: 'Peñalolén', value: 1271 },
  '13123': { name: 'Providencia', value: 2935 },
  '13124': { name: 'Pudahuel', value: 166 },
  '13125': { name: 'Quilicura', value: 76 },
  '13126': { name: 'Quinta Normal', value: 59 },
  '13127': { name: 'Recoleta', value: 82 },
  '13128': { name: 'Renca', value: 23 },
  '13129': { name: 'San Joaquín', value: 34 },
  '13130': { name: 'San Miguel', value: 527 },
  '13131': { name: 'San Ramón', value: 3 },
  '13132': { name: 'Vitacura', value: 7578 },
  '13201': { name: 'Puente Alto', value: 355 },
  '13401': { name: 'San Bernardo', value: 254 },
};

const tone = (value: number) => {
  if (value < 10) return 0;
  if (value < 50) return 1;
  if (value < 200) return 2;
  if (value < 1000) return 3;
  if (value < 3000) return 4;
  return 5;
};

function BudgetComparison() {
  const [metric, setMetric] = useState<BudgetMetric>('total');
  const maximum = Math.max(...municipalBudgets.map((commune) => commune[metric]));
  const isTotal = metric === 'total';

  return (
    <section className="story-section budget-section" aria-labelledby="budget-title">
      <div className="section-number" aria-hidden="true">01</div>
      <div className="section-copy">
        <p className="eyebrow">La desigualdad de base</p>
        <h2 id="budget-title">Las Condes dispone de 18,5 veces el presupuesto de San Ramón</h2>
        <p>
          Antes de la reforma, sus recursos municipales ya están separados por una
          brecha enorme. Y esa distancia sigue siendo visible al considerar el tamaño
          de sus poblaciones.
        </p>
      </div>

      <div className="budget-visual">
        <div className="metric-switch" aria-label="Cambiar medida del presupuesto">
          <button
            type="button"
            className={isTotal ? 'active' : ''}
            aria-pressed={isTotal}
            onClick={() => setMetric('total')}
          >
            Presupuesto total
          </button>
          <button
            type="button"
            className={!isTotal ? 'active' : ''}
            aria-pressed={!isTotal}
            onClick={() => setMetric('perCapita')}
          >
            Por habitante
          </button>
        </div>

        <p className="budget-context">
          {isTotal
            ? 'Presupuesto municipal vigente 2025 · millones de pesos'
            : 'Presupuesto vigente 2025 ÷ población censada en 2024 · pesos por habitante'}
        </p>

        <div className="budget-bars" aria-live="polite">
          {municipalBudgets.map((commune) => {
            const value = commune[metric];
            const width = Math.max(2, (value / maximum) * 100);
            const formatted = isTotal
              ? `$${number.format(Math.round(value))}M`
              : `$${number.format(Math.round(value))}`;

            return (
              <div className={`budget-row ${commune.name === 'Las Condes' ? 'high' : 'low'}`} key={commune.name}>
                <div className="budget-row-heading">
                  <span>{commune.name}</span>
                  <strong>{formatted}</strong>
                </div>
                <div className="budget-track">
                  <div
                    className="budget-fill"
                    style={{ width: `${width}%` }}
                    role="img"
                    aria-label={`${commune.name}: ${formatted}${isTotal ? ' de presupuesto vigente' : ' por habitante'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="budget-ratio">
          <strong>{isTotal ? '18,5×' : '4,7×'}</strong>
          <p>
            {isTotal
              ? 'Las Condes dispone de 18,5 veces el presupuesto municipal de San Ramón.'
              : 'Incluso por habitante, Las Condes dispone de 4,7 veces más presupuesto.'}
          </p>
        </div>
      </div>
    </section>
  );
}

function ReformBudgetComparison() {
  return (
    <>
      <section className="turn-section" aria-labelledby="turn-title">
        <p>La reforma no corrige esa brecha.</p>
        <h2 id="turn-title">La reproduce en la compensación.</h2>
        <div className="causal-chain" aria-label="Cómo la exención determina la compensación">
          <span>Más contribuciones exentas</span>
          <span>Más recaudación municipal que se deja de recibir</span>
          <span>Mayor compensación del Estado</span>
        </div>
      </section>

      <section className="story-section reform-section" aria-labelledby="reform-title">
        <div className="section-number" aria-hidden="true">02</div>
        <div className="section-copy">
          <p className="eyebrow">La compensación propuesta</p>
          <h2 id="reform-title">La reforma compensaría a Las Condes con casi medio presupuesto de San Ramón</h2>
          <p>
            La compensación estimada para Las Condes alcanza los $13.062 millones.
            Ese monto equivale al 47% del presupuesto municipal anual de San Ramón.
          </p>
        </div>

        <div className="reform-visual">
          <div className="reform-chart-heading">
            <div>
              <span>Presupuesto vigente de San Ramón</span>
              <strong>$27.857M</strong>
            </div>
            <span className="reform-year">2025 · referencia completa</span>
          </div>

          <div className="reform-budget-bar">
            <div
              className="reform-compensation-fill"
              style={{ width: `${lasCondesShareOfSanRamonBudget}%` }}
              role="img"
              aria-label="La compensación estimada para Las Condes equivale al 46,9 por ciento del presupuesto vigente 2025 de San Ramón"
            >
              <span>Compensación a Las Condes</span>
              <strong>$13.062M</strong>
            </div>
            <span className="reform-remainder">Presupuesto restante de referencia</span>
          </div>

          <div className="reform-impact">
            <strong>47%</strong>
            <p>de todo el presupuesto municipal anual de San Ramón.</p>
          </div>

          <div className="reform-san-ramon">
            <div>
              <span>Compensación estimada para San Ramón</span>
              <strong>$3 millones</strong>
            </div>
            <p>Equivale al 0,011% de su propio presupuesto vigente.</p>
          </div>

          <p className="comparison-caveat">
            Comparación de magnitudes: la compensación de Las Condes no forma parte
            del presupuesto de San Ramón.
          </p>
        </div>
      </section>
    </>
  );
}

function HorizontalComparison() {
  const [selected, setSelected] = useState<Segment>({
    name: 'Las Condes',
    value: lasCondes,
  });

  const positioned = useMemo(() => {
    let running = 0;
    return segments.map((segment) => {
      running += segment.value;
      return { ...segment, cumulative: running };
    });
  }, []);

  const select = (segment: Segment) => setSelected(segment);

  return (
    <section className="story-section comparison-section" aria-labelledby="comparison-title">
      <div className="section-number" aria-hidden="true">03</div>
      <div className="section-copy">
        <p className="eyebrow">La desigualdad repartida</p>
        <h2 id="comparison-title">Una comuna contra treinta</h2>
        <p>
          Las Condes recibiría más compensación que las 30 comunas de menor monto
          juntas. Recién al sumar una comuna número 31 se supera su cifra.
        </p>
      </div>

      <div className="bar-chart" aria-label="Comparación horizontal de compensaciones estimadas">
        <div className="chart-row">
          <div className="chart-row-heading">
            <span>Las Condes</span>
            <strong>${number.format(lasCondes)}M</strong>
          </div>
          <div className="bar-track">
            <button
              type="button"
              className="single-bar"
              style={{ width: `${(lasCondes / chartMax) * 100}%` }}
              aria-label={`Las Condes, ${number.format(lasCondes)} millones de pesos`}
              onMouseEnter={() => select({ name: 'Las Condes', value: lasCondes })}
              onFocus={() => select({ name: 'Las Condes', value: lasCondes })}
              onClick={() => select({ name: 'Las Condes', value: lasCondes })}
            >
              <span>${number.format(lasCondes)}M</span>
            </button>
          </div>
        </div>

        <div className="chart-row chart-row-stacked">
          <div className="chart-row-heading">
            <span>Comunas de menor monto, apiladas</span>
            <strong>${number.format(totalThirtyOne)}M</strong>
          </div>
          <div className="bar-track stacked-bar">
            {positioned.map((segment, index) => (
              <button
                type="button"
                key={segment.name}
                className={`stack-segment tone-${index % 3}${segment.crosses ? ' crosses' : ''}`}
                style={{ width: `${(segment.value / chartMax) * 100}%` }}
                aria-label={`${segment.name}, ${number.format(segment.value)} millones de pesos; acumulado ${number.format(segment.cumulative)} millones`}
                onMouseEnter={() => select(segment)}
                onFocus={() => select(segment)}
                onClick={() => select(segment)}
              >
                {['Ñuñoa', 'La Reina', 'Providencia'].includes(segment.name) && (
                  <span>{segment.name}</span>
                )}
              </button>
            ))}
            <span
              className="thirty-marker"
              style={{ left: `${(totalThirty / chartMax) * 100}%` }}
              aria-hidden="true"
            />
            <span
              className="las-condes-marker"
              style={{ left: `${(lasCondes / chartMax) * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="chart-annotations" aria-hidden="true">
            <span style={{ left: `${(totalThirty / chartMax) * 100}%` }}>30 comunas · $11.520M</span>
            <span style={{ left: `${(lasCondes / chartMax) * 100}%` }}>1 Las Condes</span>
          </div>
        </div>

        <div className="chart-axis" aria-hidden="true">
          <span>$0</span>
          <span>$5.000</span>
          <span>$10.000</span>
          <span>$15.000M</span>
        </div>

        <div className="chart-detail" aria-live="polite">
          <div>
            <span className="detail-label">Seleccionado</span>
            <strong>{selected.name}</strong>
          </div>
          <strong className="detail-value">${number.format(selected.value)} millones</strong>
          {selected.detail && <p>{selected.detail}</p>}
        </div>

        <div className="chart-takeaways">
          <p><strong>30 comunas</strong><span>$11.520M</span></p>
          <p><strong>Brecha restante</strong><span>$1.542M</span></p>
          <p><strong>31ª comuna</strong><span>Providencia</span></p>
        </div>
      </div>
    </section>
  );
}

function MapStory() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(720);
  const [selectedCode, setSelectedCode] = useState('13131');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => setWidth(Math.max(300, Math.round(stage.clientWidth)));
    update();
    setMounted(true);

    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const height = width < 480
    ? Math.max(390, width * 1.15)
    : Math.min(720, Math.max(560, width * 0.92));
  const showCallouts = width >= 660;
  const mapInsetX = showCallouts ? Math.min(110, width * 0.16) : 12;

  const projection = useMemo(
    () => geoMercator().fitExtent(
      [[mapInsetX, 12], [width - mapInsetX, height - 12]],
      geography,
    ),
    [height, mapInsetX, width],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const selected = mapValues[selectedCode];

  const labelCodes = width < 480
    ? new Set(['13114', '13115'])
    : new Set(['13114', '13115', '13132']);

  const criticalLayout: Record<string, { side: 'left' | 'right'; dy: number }> = {
    '13103': { side: 'left', dy: -38 },
    '13117': { side: 'left', dy: 28 },
    '13116': { side: 'right', dy: -24 },
    '13131': { side: 'right', dy: 44 },
  };

  return (
    <section className="story-section map-section" aria-labelledby="map-story-title">
      <div className="section-number" aria-hidden="true">04</div>
      <div className="section-copy">
        <p className="eyebrow">El territorio</p>
        <h2 id="map-story-title">La diferencia también se ve en el mapa</h2>
        <p>
          El celeste concentra los montos más altos. El rojo muestra las comunas
          que recibirían una fracción mínima de esa compensación.
        </p>
      </div>

      <div className="map-visual">
        <div className="map-title-row">
          <div>
            <h3>Compensación por menor recaudación de contribuciones</h3>
            <p>Exención a mayores de 65 años · millones de pesos</p>
          </div>
          <span className="map-color-note"><i /> menor <b /> mayor</span>
        </div>

        <div className="map-stage" ref={stageRef}>
          {!mounted ? (
            <svg
              className="map-placeholder"
              aria-hidden="true"
              viewBox={`0 0 ${width} ${height}`}
            />
          ) : (
            <svg
            role="img"
            aria-labelledby="map-svg-title map-svg-desc"
            viewBox={`0 0 ${width} ${height}`}
          >
            <title id="map-svg-title">Compensación estimada por comuna del Gran Santiago</title>
            <desc id="map-svg-desc">
              Mapa coroplético. El rojo identifica las compensaciones más bajas y el
              celeste las más altas. Cada comuna se puede seleccionar.
            </desc>

            <g className="map-layer">
              {geography.features.map((feature) => {
                const code = String(feature.properties.COMUNA);
                const metric = mapValues[code];
                if (!metric) return null;
                return (
                  <path
                    key={code}
                    d={path(feature) ?? undefined}
                    className={`map-shape tone-${tone(metric.value)}${selectedCode === code ? ' selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${metric.name}, ${number.format(metric.value)} millones de pesos`}
                    onMouseEnter={() => setSelectedCode(code)}
                    onFocus={() => setSelectedCode(code)}
                    onClick={() => setSelectedCode(code)}
                  >
                    <title>{`${metric.name}: $${number.format(metric.value)} millones`}</title>
                  </path>
                );
              })}
            </g>

            <g className="map-label-layer" aria-hidden="true">
              {geography.features
                .filter((feature) => labelCodes.has(String(feature.properties.COMUNA)))
                .map((feature) => {
                  const code = String(feature.properties.COMUNA);
                  const [x, y] = path.centroid(feature);
                  const metric = mapValues[code];
                  return (
                    <text key={code} className="map-label" x={x} y={y}>
                      <tspan x={x} dy="-0.15em">{metric.name}</tspan>
                      <tspan x={x} dy="1.2em">${number.format(metric.value)}</tspan>
                    </text>
                  );
                })}
            </g>

            {showCallouts && (
              <g className="critical-callout-layer" aria-hidden="true">
                {geography.features
                  .filter((feature) => criticalLayout[String(feature.properties.COMUNA)])
                  .map((feature) => {
                    const code = String(feature.properties.COMUNA);
                    const [targetX, targetY] = path.centroid(feature);
                    const layout = criticalLayout[code];
                    const labelX = layout.side === 'left'
                      ? mapInsetX - 12
                      : width - mapInsetX + 12;
                    const labelY = targetY + layout.dy;
                    const metric = mapValues[code];
                    return (
                      <g key={code}>
                        <line
                          x1={targetX}
                          y1={targetY}
                          x2={layout.side === 'left' ? labelX + 7 : labelX - 7}
                          y2={labelY - 4}
                        />
                        <circle cx={targetX} cy={targetY} r="4" />
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor={layout.side === 'left' ? 'end' : 'start'}
                        >
                          <tspan x={labelX}>{metric.name}</tspan>
                          <tspan x={labelX} dy="1.2em">${number.format(metric.value)} millones</tspan>
                        </text>
                      </g>
                    );
                  })}
              </g>
            )}
            </svg>
          )}
        </div>

        <div className="critical-cases" aria-label="Comunas con menor compensación">
          {['13131', '13116', '13117', '13103'].map((code) => (
            <button type="button" key={code} onClick={() => setSelectedCode(code)}>
              <span>{mapValues[code].name}</span>
              <strong>${number.format(mapValues[code].value)}M</strong>
            </button>
          ))}
        </div>

        <div className="map-legend" aria-label="Escala de compensación en millones de pesos">
          {[
            ['Hasta 9', 0],
            ['10–49', 1],
            ['50–199', 2],
            ['200–999', 3],
            ['1.000–2.999', 4],
            ['3.000 o más', 5],
          ].map(([label, toneValue]) => (
            <span key={String(label)}><i className={`tone-${toneValue}`} />{label}</span>
          ))}
        </div>

        <div className="map-selection" aria-live="polite">
          <div>
            <span>Comuna seleccionada</span>
            <strong>{selected.name}</strong>
          </div>
          <strong>${number.format(selected.value)} millones</strong>
        </div>
      </div>
    </section>
  );
}

export default function DataStory() {
  return (
    <main>
      <header className="site-header">
        <a className="site-mark" href="#top" aria-label="Ir al inicio">
          <span>DATA</span>
          <span>STORY</span>
        </a>
        <p>Reforma tributaria · Gran Santiago</p>
      </header>

      <article id="top">
        <section className="hero">
          <p className="eyebrow">Dos comunas · dos puntos de partida</p>
          <h1>Dos comunas separadas por una profunda desigualdad</h1>
          <p className="hero-deck">
            Las Condes administra 18,5 veces el presupuesto municipal de San Ramón.
            Incluso por habitante, dispone de 4,7 veces más recursos.
          </p>
          <a className="scroll-link" href="#budget-title">Ver la comparación <span aria-hidden="true">↓</span></a>
        </section>

        <BudgetComparison />
        <ReformBudgetComparison />
        <HorizontalComparison />
        <MapStory />

        <section className="method-section" aria-labelledby="method-title">
          <p className="eyebrow">Qué muestra —y qué no</p>
          <h2 id="method-title">Compensación no significa ingreso municipal</h2>
          <p>
            El presupuesto vigente 2025 y la compensación estimada son medidas distintas.
            El cálculo por habitante divide ese presupuesto por la población censada en
            2024. Las cifras se comparan para dimensionar la brecha, no porque una forme
            parte de la otra.
          </p>
        </section>
      </article>

      <footer>
        <p>
          Compensación estimada:{' '}
          <a
            href="https://static1.squarespace.com/static/5f31be959fceb35b50e59a1f/t/6a8092e034b78954cf0cd668/1786811106289/Compensaci%C3%B3n_Megarreforma_OPESWEB_c.pdf"
            target="_blank"
            rel="noreferrer"
          >
            OPES
          </a>, con datos del Ministerio de Hacienda obtenidos por Transparencia.
          Simulación; no corresponde a una asignación definitiva.
        </p>
        <p>
          Presupuesto vigente 2025:{' '}
          <a href="https://www.monitormunicipios.cl/comuna/san-ramon" target="_blank" rel="noreferrer">
            San Ramón
          </a>{' '}
          y{' '}
          <a href="https://www.monitormunicipios.cl/comuna/las-condes" target="_blank" rel="noreferrer">
            Las Condes
          </a>. Fichas basadas en SINIM · SUBDERE.
        </p>
        <p>
          Población:{' '}
          <a
            href="https://censo2024.ine.gob.cl/wp-content/uploads/2025/03/13_PRESENTACION-R_REGIONAL-RM.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Censo 2024, INE
          </a>. Las Condes: 296.134 habitantes; San Ramón: 76.002.
        </p>
        <p>Límites comunales: ArcGIS Feature Service, actualización 2024.</p>
      </footer>
    </main>
  );
}
