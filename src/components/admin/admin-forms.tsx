"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveEpisode, saveModule, type AdminFormState } from "@/app/admin/actions";
import type { AdminEpisode, AdminModule } from "@/lib/admin/data";
import { formatDuration } from "@/lib/validation";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
      {pending ? "Salvando…" : children}
    </button>
  );
}

function Feedback({ state }: { state: AdminFormState }) {
  if (state.error) {
    return (
      <p role="alert" className="adm-alert adm-alert--error">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p role="status" className="adm-alert adm-alert--ok">
        {state.message}
      </p>
    );
  }
  return null;
}

function Field({
  label,
  name,
  hint,
  error,
  defaultValue,
  type = "text",
  placeholder,
  inputMode,
  textarea,
  rows = 4,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  textarea?: boolean;
  rows?: number;
}) {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="adm-input"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="adm-input"
        />
      )}
      {error ? (
        <p id={`${id}-e`} className="adm-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-h`} className="adm-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Publish({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="adm-check">
      <input type="checkbox" name="published" defaultChecked={checked} />
      <span>
        <b>{label}</b>
        <i>Só o que está publicado aparece para os alunos.</i>
      </span>
    </label>
  );
}

/** Criar ou editar um módulo. Com `module`, é edição; sem, é criação. */
export function ModuleForm({
  module,
  defaultPosition,
}: {
  module?: AdminModule;
  defaultPosition: number;
}) {
  const [state, action] = useActionState<AdminFormState, FormData>(saveModule, {});
  const v = state.values;
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="adm-form" noValidate>
      {module ? <input type="hidden" name="id" value={module.id} /> : null}
      <Feedback state={state} />
      <Field label="Título" name="title" defaultValue={v?.title ?? module?.title} error={e.title} />
      <div className="adm-grid2">
        <Field
          label="Posição"
          name="position"
          inputMode="numeric"
          defaultValue={v?.position ?? String(module?.position ?? defaultPosition)}
          error={e.position}
          hint="Ordem do módulo no curso: 1, 2, 3…"
        />
        <Field
          label="Endereço (slug)"
          name="slug"
          defaultValue={v?.slug ?? module?.slug}
          error={e.slug}
          hint="Deixe vazio para gerar a partir do título."
        />
      </div>
      <Field
        label="Descrição"
        name="description"
        textarea
        defaultValue={v?.description ?? module?.description ?? ""}
        error={e.description}
      />
      <Field
        label="Imagem de capa (opcional)"
        name="thumbnail_url"
        defaultValue={v?.thumbnail_url ?? module?.thumbnail_url ?? ""}
        error={e.thumbnail_url}
        placeholder="https://… ou /img/capa.webp"
      />
      <Publish checked={v ? v.published === "on" : (module?.published ?? false)} label="Publicar módulo" />
      <div className="adm-actions">
        <Submit>{module ? "Salvar módulo" : "Criar módulo"}</Submit>
        <Link href="/admin/modulos" className="adm-btn">
          Voltar
        </Link>
      </div>
    </form>
  );
}

/** Criar ou editar uma aula de um módulo. */
export function EpisodeForm({
  moduleId,
  episode,
  defaultPosition,
}: {
  moduleId: string;
  episode?: AdminEpisode;
  defaultPosition: number;
}) {
  const [state, action] = useActionState<AdminFormState, FormData>(saveEpisode, {});
  const v = state.values;
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="adm-form" noValidate>
      <input type="hidden" name="module_id" value={moduleId} />
      {episode ? <input type="hidden" name="id" value={episode.id} /> : null}
      <Feedback state={state} />
      <Field label="Título da aula" name="title" defaultValue={v?.title ?? episode?.title} error={e.title} />
      <div className="adm-grid2">
        <Field
          label="Posição no módulo"
          name="position"
          inputMode="numeric"
          defaultValue={v?.position ?? String(episode?.position ?? defaultPosition)}
          error={e.position}
          hint="Ordem da aula dentro do módulo."
        />
        <Field
          label="Duração"
          name="duration"
          defaultValue={v?.duration ?? (episode ? formatDuration(episode.duration_seconds) : "")}
          error={e.duration}
          placeholder="12:30"
          hint="Minutos e segundos (mm:ss). Conta para o progresso do aluno."
        />
      </div>
      <Field
        label="Descrição"
        name="description"
        textarea
        defaultValue={v?.description ?? episode?.description ?? ""}
        error={e.description}
      />
      <div className="adm-grid2">
        <Field
          label="ID do vídeo (Bunny Stream)"
          name="bunny_video_id"
          defaultValue={v?.bunny_video_id ?? episode?.bunny_video_id ?? ""}
          error={e.bunny_video_id}
          hint="O código do vídeo na biblioteca. Pode ficar vazio por enquanto."
        />
        <Field
          label="Endereço (slug)"
          name="slug"
          defaultValue={v?.slug ?? episode?.slug}
          error={e.slug}
          hint="Deixe vazio para gerar a partir do título."
        />
      </div>
      <Field
        label="Imagem da aula (opcional)"
        name="thumbnail_url"
        defaultValue={v?.thumbnail_url ?? episode?.thumbnail_url ?? ""}
        error={e.thumbnail_url}
        placeholder="https://… ou /img/aula.webp"
      />
      <Publish checked={v ? v.published === "on" : (episode?.published ?? false)} label="Publicar aula" />
      <div className="adm-actions">
        <Submit>{episode ? "Salvar aula" : "Criar aula"}</Submit>
        <Link href={`/admin/modulos/${moduleId}`} className="adm-btn">
          Voltar ao módulo
        </Link>
      </div>
    </form>
  );
}
