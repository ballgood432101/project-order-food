import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
})
export class QrCodeModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { qrcode: string },
    private dialogRef: MatDialogRef<QrCodeModalComponent>
  ) {}

  ngOnInit(): void {}

  onConfirm() {
    this.dialogRef.close('success');
  }
}
