import { EventEmitter } from '@angular/core';

export interface PlayerOutputs {
  ready?: EventEmitter<YT.Player>;
  change?: EventEmitter<YT.EventArgs>;
}

export interface PlayerSize {
  height?: number;
  width?: number;
}

export interface PlayerApiScriptOptions {
  protocol?: string;
}