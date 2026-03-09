import { Injectable } from '@angular/core';
import { Source } from './source';
import { Facebook } from './facebook';
import { Custom } from './custom';
import { Initials } from './initials';
import { Gravatar } from './gravatar';
import { Value } from './value';
import { Github } from './github';
import { SourceCreator } from './source.creator';
import { AvatarSource } from './avatar-source.enum';
import { AvatarConfigService } from '../avatar-config.service';
import { defaultDisableSrcCache } from '../avatar.service';
import { CustomNoCache } from './custom-no-cache';

/**
 * Factory class that implements factory method pattern.
 * Used to create Source implementation class based
 * on the source Type
 */
@Injectable({providedIn: 'root'})
export class SourceFactory {
  private sources: { [key: string]: SourceCreator } = {};

  constructor(avatarConfigService: AvatarConfigService) {
    const disableSrcCache = avatarConfigService.getDisableSrcCache(defaultDisableSrcCache);
    this.sources[AvatarSource.FACEBOOK] = Facebook;
    this.sources[AvatarSource.GRAVATAR] = Gravatar;
    this.sources[AvatarSource.CUSTOM] = disableSrcCache ? CustomNoCache : Custom;
    this.sources[AvatarSource.INITIALS] = Initials;
    this.sources[AvatarSource.VALUE] = Value;
    this.sources[AvatarSource.GITHUB] = Github;
  }

  public newInstance(sourceType: AvatarSource, sourceValue: string): Source {
    return new this.sources[sourceType](sourceValue);
  }
}
