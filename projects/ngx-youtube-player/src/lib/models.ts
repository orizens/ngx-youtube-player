import 'youtube';
import { EventEmitter } from '@angular/core';

export interface IPlayerOutputs {
  ready?: EventEmitter<YT.Player>;
  change?: EventEmitter<YT.PlayerEvent>;
}

export interface IPlayerSize {
  height?: number;
  width?: number;
}

export interface IPlayerApiScriptOptions {
  protocol?: string;
}
