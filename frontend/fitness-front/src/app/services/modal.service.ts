import { Injectable, inject, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AddProgramComponent } from '../components/add-program/add-program.component';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private componentRef: ComponentRef<AddProgramComponent> | null = null;

  programAdded$ = new Subject<void>();

  openAddProgram() {
    if (this.overlayRef) {
      return; // Modal zaten açık
    }

    // Overlay pozisyon ve yapılandırması
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    // Overlay yaratma
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      // Navigation sırasında hemen kapanmayı engelle
      disposeOnNavigation: false,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      panelClass: 'app-modal-pane',
      width: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    // Component'i portal olarak yükle
    const portal = new ComponentPortal(AddProgramComponent);
    this.componentRef = this.overlayRef.attach(portal);
    console.log('🧩 Component portal attached:', !!this.componentRef);

    // Component olaylarını dinle
    this.componentRef.instance.programAdded.subscribe(() => {
      console.log('📨 programAdded event alındı (service)');
      this.programAdded$.next();
      this.closeAddProgram('programAdded');
    });

    this.componentRef.instance.modalClosed.subscribe(() => {
      console.log('📨 modalClosed event alındı (service)');
      this.closeAddProgram('modalClosed');
    });

  // Not: Backdrop tıklayınca kapatma devre dışı.
  // Aynı tıklama event'inde overlay açıldığı için hemen kapanma yaşanıyordu.
  // İstenirse ileride zaman gecikmeli subscribe edilerek eklenebilir.

    // Overlay detach/attachments logları
    this.overlayRef.detachments().subscribe(() => {
      console.log('🔌 Overlay detach edildi');
    });

    console.log('🚀 CDK Overlay ile modal açıldı');
  }

  closeAddProgram(reason: string = 'manual') {
    if (this.overlayRef) {
      console.log('🧹 closeAddProgram çağrıldı. Reason:', reason);
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.componentRef = null;
      console.log('❌ CDK Modal kapatıldı');
    }
  }
}
