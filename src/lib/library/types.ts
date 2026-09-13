import type { LevelId } from '../../types';
import type { MaterialKind } from '../materials';

/**
 * The published library: material that reaches every customer without a new
 * build of the app.
 *
 * Everything the app shipped until now was decided at build time — a file in
 * `public/materials` and a row in the catalogue, then a redeploy. That is fine
 * for a set of booklets prepared in advance and useless for "I want to put
 * this up tonight". This is the other half: an owner publishes from inside the
 * app, and the next person to open it sees the file.
 *
 * The interface is kept narrow and provider-agnostic on purpose. The cloud
 * adapter is one small module that can be read in a sitting and swapped for
 * another provider, and a local fake implementing the same five calls is what
 * lets the whole flow be exercised — and tested — without a cloud account.
 */

export interface RemoteMaterial {
  id: string;
  levelId: LevelId;
  paperId: string;
  sectionId: string | null;
  topicId: string | null;
  title: string;
  fileName: string;
  kind: MaterialKind;
  size: number;
  /** Epoch milliseconds. */
  publishedAt: number;
  /** Where a customer fetches it from. Public; no sign-in required. */
  url: string;
  /** The mark the stored bytes already carry. */
  watermark: string;
}

export interface PublishInput {
  levelId: LevelId;
  paperId: string;
  sectionId: string | null;
  topicId: string | null;
  title: string;
  fileName: string;
  kind: MaterialKind;
}

export interface LibraryUser {
  id: string;
  email: string;
}

export interface RemoteLibrary {
  /** Human-readable name of the backing service, for the admin screen. */
  readonly name: string;

  /**
   * Everything published, for every customer, without signing in.
   *
   * Must never throw: a customer with no network, or an outage at the
   * provider, gets the material that shipped with the app rather than an
   * error screen. Returns an empty list when it cannot reach the service.
   */
  list(): Promise<RemoteMaterial[]>;

  currentUser(): Promise<LibraryUser | null>;
  signIn(email: string, password: string): Promise<LibraryUser>;
  signOut(): Promise<void>;

  /**
   * Publish a file so every customer can read it.
   *
   * The caller stamps the bytes before handing them over, so what is stored
   * is already watermarked and there is no unstamped original behind the URL.
   *
   * Whether the caller is allowed to do this is decided by the service's own
   * rules, not by the app: a signed-in non-owner must be refused by the
   * server. Hiding the button is presentation, not security.
   */
  publish(input: PublishInput, body: Blob): Promise<RemoteMaterial>;

  /** Withdraw a published material. Owner only, enforced by the service. */
  unpublish(id: string): Promise<void>;
}
